import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @Output() exportLoggedIn = new EventEmitter<boolean>();
  public getJsonValue: any;
  public postJsonValue: any;
  loggedIn: boolean = false;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {


  }

  isLoggedIn(name: string, username: string) {
    this.http.get<any[]>(`https://jsonplaceholder.typicode.com/users?name=${encodeURIComponent(name)}`)
      .subscribe((data) => {
        if (data.length > 0) {
          const user = data[0]; // Accedemos al primer usuario encontrado
          console.log(user.name);      // "Leanne Graham"
          console.log(user.username);  // "Bret"
          this.getJsonValue = user;

          if (name === user.name && username === user.username) {
            this.loggedIn = true;
            alert('Login Successful');
            this.exportLoggedIn.emit(this.loggedIn);

          } else {
            alert('Login Failed');
          }
        } else {
          alert('Login Failed');
        }
      }, (error) => {
        console.error('Error fetching user data', error);
        alert('Login Failed');
      });
  }



  public getMethod(name:string) {
    this.http.get('https://jsonplaceholder.typicode.com/users?name='+name)
      .subscribe((data) => {
        console.log(data);
        this.getJsonValue = data;
      });
  }
  public postMethod() {
    this.http.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1
    })
      .subscribe((data) => {
        console.log(data);
        this.postJsonValue = data;
      });
  }

}
