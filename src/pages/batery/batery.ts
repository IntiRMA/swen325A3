import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-batery',
  templateUrl: 'batery.html'
})
export class BateryPage {

  constructor(public navCtrl: NavController,public data: DataProvider, public evt:Events) {
    this.evt.subscribe("alert",()=>{this.presentAlert()});
  }

  presentAlert() {

    self.alert("Person did not move for 5 minutes");

    if(this.data.updated) {
      this.navCtrl.push(HomePage, {
        time: this.data.lasttime,
        motion: this.data.lastmotion,
        loc: this.data.lastLoc,
        places: this.data.places,
        status: this.data.status,
        update: true,
        color:this.data.color
      });
    }else{
      this.navCtrl.push(HomePage, {
        update: false
      });
    }

  }

}
