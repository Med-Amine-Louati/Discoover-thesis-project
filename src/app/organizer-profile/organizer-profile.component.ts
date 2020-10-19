import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organizer-profile',
  templateUrl: './organizer-profile.component.html',
  styleUrls: ['./organizer-profile.component.css']
})
@Injectable()
export class OrganizerProfileComponent implements OnInit {

  constructor(private http: HttpClient) {

   }
   selectedGender = '';
   organizer = {
     first_name : '',
     last_name : '',
     gender : '',
     location : '',
     email : '',
     password : '',
     bio : '',
     phone_number : ''
    };
    fullName = this.organizer.first_name + ' ' + this.organizer.last_name;

  ngOnInit(): void {
    this.http.get('api/user/5f8af2f5d7ebfa75d4997522')
    .subscribe((res : any)=>{
      console.log(res)
      this.organizer = res
    })
  }
  genderHandler(event: any){
    this.organizer.gender = event.target.value;
    console.log(this.organizer.gender)
  }
  onClick(){
    console.log('organizer profile updated with ==>', this.organizer);
    this.http.put('/api/user/edit',this.organizer)
    .subscribe((res)=>{
      console.log(res)
    })

  }

}
