import { Component } from '@angular/core';
import {Chart} from 'chart.js';
import {ViewChild} from "@angular/core";
import {DataProvider} from "../../providers/data/data";
import {Events} from 'ionic-angular';
import {AlertController} from "ionic-angular";
import {NavParams} from "ionic-angular";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  constructor(public data: DataProvider, public evt:Events,public alertCtrl:AlertController,public params:NavParams) {
    if(this.params.get("update")) {
      this.data.lasttime = params.get("time");
      this.data.lastmotion = params.get("motion");
      this.data.lastLoc = params.get("loc");
      this.data.places = params.get("places");
      this.data.status = params.get("status");
      this.data.color=params.get("color");
    }
    this.evt.subscribe("update",()=>{this.loadGraph()});

  }

  ionViewDidLoad() {
    this.loadGraph();
  }

  loadGraph() {

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: ["living", "kitchen", "dining", "toilet", "bedroom"],
        datasets: [{
          label: '# of Votes',
          data: [this.data.places["living"], this.data.places["kitchen"], this.data.places["dining"], this.data.places["toilet"], this.data.places["bedroom"]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });
  }
}

