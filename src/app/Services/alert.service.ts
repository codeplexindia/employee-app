import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  success(message: string) {
    Swal.fire('Success', message, 'success');
  }

  error(message: string) {
    Swal.fire('Error', message, 'error');
  }

  confirm(title: string, text: string, callback: () => void) {
    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }

}
