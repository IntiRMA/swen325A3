import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';

declare var Paho : any;
/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  public  lastLoc='';
  public  lastmotion =0+"seconds";
  public  lasttime=0.0;
  public  places={"living":0, "kitchen":0, "dining":0, "toilet":0,"bedroom":0};
  public status={"living":100, "kitchen":100, "dining":100, "toilet":100,"bedroom":100};
  private mqttStatus: string = 'Disconnected';
  private mqttClient: any = null;
  private message: any = '';
  private messageToSend: string = '2018-08-11 13:32:01,toilet,1,95';
  private topic: string = 'swen325/a3';
  private clientId: string = 'SWAG';
  private triggered=false;
  private firstroun=true;
  public updated=false;
  public color="#f00";

  constructor(public evt: Events) {
    console.log('Hello DataProvider Provider');
    this.places={"living":0, "kitchen":0, "dining":0, "toilet":0,"bedroom":0};
    this.status={"living":0, "kitchen":0, "dining":0, "toilet":0,"bedroom":0};
  }



  public connect= () =>{
    if(this.mqttStatus== 'Connected'){
      return;
    }
    this.color='#f90';
    this.mqttStatus = 'Connecting...';
    //this.mqttClient = new Paho.MQTT.Client('m10.cloudmqtt.com', 31796, '/mqtt', this.clientId);
    this.mqttClient = new Paho.MQTT.Client('barretts.ecs.vuw.ac.nz', 8883, '/mqtt', this.clientId);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log('Connecting to mqtt via websocket');
    //this.mqttClient.connect({timeout:10, userName:'ptweqash', password:'ncU6vlGPp1mN', useSSL:true, onSuccess:this.onConnect, onFailure:this.onFailure});
    this.mqttClient.connect({timeout:10, useSSL:false, onSuccess:this.onConnect, onFailure:this.onFailure});
  }

  public disconnect () {
    if(this.mqttStatus == 'Connected') {
      this.color='#f90';
      this.mqttStatus = 'Disconnecting...';
      this.mqttClient.disconnect();
      this.mqttStatus = 'Disconnected';
      this.color="#f00";
    }
  }

  public sendMessage () {
    if(this.mqttStatus == 'Connected') {
      this.mqttClient.publish(this.topic, this.messageToSend);
    }
  }

  public onConnect = () => {
    console.log('Connected');
    this.mqttStatus = 'Connected';
    this.color="#090";

    // subscribe
    this.mqttClient.subscribe(this.topic);
  }

  public onFailure = (responseObject) => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  }

  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  }

  public onMessageArrived = (message) => {
    this.message = message.payloadString;
    var m=this.message.split(",");
    this.status[m[1]]=m[3]+"%";
    var time=m[0].split(" ")[1].split(":");
    var hour=time[0];
    var min=time[1];
    var sec=time[2];
    var tot=Number(hour)*3600+Number(min)*60+Number(sec);
    if(this.firstroun){
      this.lasttime=tot;
      this.firstroun=false;
    }
    if((tot-this.lasttime>=5*60)&&(!this.triggered)){
      this.evt.publish("alert",0);
      this.triggered=true;
    }
    if(m[2]=="1"){
      this.updated=true;
      this.triggered=false;
      this.lastLoc=m[1];
      this.places[this.lastLoc]+=1;
      this.lastmotion=(tot-this.lasttime)+" seconds";
      this.lasttime=tot;
      this.evt.publish("update",0);
    }

  }



}
