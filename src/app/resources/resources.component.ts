import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IResourceGetAllQueryResult } from './resource';
import { ResourcesService } from './resources.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any> ;
  resources: IResourceGetAllQueryResult[] = [];
  selectedResource:any;
  isVisible: boolean = false;
  message='';
  
  constructor(private resourcesService: ResourcesService,
    public dialog: MatDialog,
    private fb: FormBuilder) { }

    bookForm: FormGroup = new FormGroup({
      dateFrom: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
      dateTo: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
      quantity: new FormControl(0, Validators.required)
    });
  

  ngOnInit(): void {
    this.resourcesService.getResources().subscribe({
      next: data => {
        this.resources = data.model;
      },
      error: err => console.log(err)
    });
  }

  open(event:any, id:any) {
    this.resourcesService.getResource(id).subscribe({
      next: data => {
        this.selectedResource = data.model;
        this.bookForm.patchValue({
          dateFrom:new Date(this.selectedResource.dateFrom).toISOString().split('T')[0] ,
          dateTo:new Date(this.selectedResource.dateTo).toISOString().split('T')[0] ,
          quantity: this.selectedResource.quantity
        });
        this.openDialog();
        console.log( this.selectedResource )
      },
      error: err => console.log(err)
    });
   
  }

  openDialog() {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe(result => {
            if (result !== 'no') {
                console.log(result);
            } else if (result === 'no') {
               console.log('User clicked no.');
            }
            this.selectedResource=null;
    })
}


onSend(form: any){  
  if(form.status === 'INVALID')
  {
    this.message=this.showErrors(form);
    alert(this.message);
  }else{
      console.log(form.value)
      let book={
        "dateFrom":new Date(form.value.dateFrom) ,
        "dateTo": new Date(form.value.dateTo),
        "quantity": form.value.quantity,
        "resourceId": this.selectedResource.id
    };
      this.resourcesService.book(book).subscribe({
        next: data => {
          if (data.statusCode==201) {
            this.dialog.closeAll();
            alert("Booking Successed");
          }
          else{
            alert(JSON.stringify(data.errors));
          }
        },
        error: err =>alert(JSON.stringify(err.error.errors))
      });
       
  }
  
}

showAlert() : void {
  if (this.isVisible) { 
    return;
  } 
  this.isVisible = true;
  setTimeout(()=> this.isVisible = false,2500)
}

showErrors(form: any){
   let errorMessage='';
  Object.keys(form.controls).forEach(key => {
    let controlErrors = form.get(key).errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
       console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
      errorMessage=errorMessage +' ' + 'Key control: ' + key + ', keyError: ' + keyError +' \n';
      });
    }
  });
  return errorMessage;
}

}
