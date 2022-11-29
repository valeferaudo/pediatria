import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-line-loader',
  templateUrl: './line-loader.component.html',
  styleUrls: ['./line-loader.component.css']
})
export class LineLoaderComponent implements OnInit {

  constructor(public loaderService: LoaderService) { 
  }

  ngOnInit(): void {
  }

}
