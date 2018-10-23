import { Component } from '@angular/core';

import { BateryPage } from '../batery/batery';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = BateryPage;

  constructor() {

  }
}
