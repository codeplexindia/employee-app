import { Block } from '@angular/compiler';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Employee } from '../../Models/employee';
import { EmployeeService } from '../../Services/employee.service';
import { AlertService } from '../../Services/alert.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  @ViewChild('myModal') modal: ElementRef | undefined;

  employeeList: Employee[] = [];
  empService = inject(EmployeeService);
  employeeform: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private alertService: AlertService) {}

  ngOnInit(): void {
    this.setFormState();
    this.getEmployee();
  }

  openModal() {
    const empModal = document.getElementById('myModal');
    if (empModal != null) {
      empModal.style.display = 'block';
    }
  }

  closeModal() {
    this.setFormState();
    if (this.modal != null) {
      this.modal.nativeElement.style.display = 'none';
    }
  }

  getEmployee() {
    this.empService.getAllEmployee().subscribe((res) => {
      this.employeeList = res;
    });
  }

  setFormState() {
    this.employeeform = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
      age: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      status: [false, [Validators.required]],
    });
  }

  formValues: any;
  onSubmit() {
    console.log(this.employeeform.value);
    if (this.employeeform.invalid) {
      alert('Please fill All Fields');
      this.alertService.error('Please, enter all values!!');
      return;
    }
    if (this.employeeform.value.id == 0) {
      this.formValues = this.employeeform.value;
      this.empService.addEmployee(this.formValues).subscribe((res) => {
        this.alertService.success('Employee added succesfully');
        this.getEmployee();
        this.employeeform.reset();
        this.closeModal();
      });
    } else {
      this.formValues = this.employeeform.value;
      this.empService.updateEmployee(this.formValues).subscribe((res) => {
        this.alertService.success('Employee updated succesfully');
        this.getEmployee();
        this.employeeform.reset();
        this.closeModal();
      });
    }
  }

  onDelete(id: number) {
    this.alertService.confirm(
      'Are you sure?',
      'do you want to delete this Employee',
      () => {
        this.empService.deleteEmployee(id).subscribe((res) => {
          this.alertService.success('Employee deleted succesfully');
          this.getEmployee();
        });
      }
    );
  }

  onEdit(Employee: Employee) {
    this.openModal();
    this.employeeform.patchValue(Employee);
  }
}
