import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../service/form.service';
import {SectorData, SectorItem} from "../model/form-data.model";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  formGroup: FormGroup;
  sectors: SectorItem[] = [];

  nameErrorMessage = '';
  sectorErrorMessage = '';
  agreeErrorMessage = '';

  constructor(private formBuilder: FormBuilder, private formService: FormService) {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      sectorSelection: [[], Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      sessionId: ['']
    });
  }

  ngOnInit(): void {
    this.formService.getDataFromBackend().subscribe(
      (sectorData: SectorData) => {
        this.sectors = sectorData.sectorList;
        this.processHierarchicalSelections();
      },
      error => {
        console.error(error);
      }
    );
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      this.formService.submitFormData(formData).subscribe(
        (response) => {
          console.log('Response from server:', response);
          this.formGroup.controls['sessionId'].setValue(response.sessionId);
          this.formGroup.controls['name'].setValue(response.name);
          this.formGroup.controls['sectorSelection'].setValue(response.sectorSelection);
          this.formGroup.controls['agreeToTerms'].setValue(response.agreeToTerms);
          window.alert('Form submitted successfully!');
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      this.nameErrorMessage = this.formGroup.controls['name'].hasError('required') ? 'Name is required' : '';
      this.sectorErrorMessage = this.formGroup.controls['sectorSelection'].hasError('required') ? 'Sector is required' : '';
      this.agreeErrorMessage = this.formGroup.controls['agreeToTerms'].hasError('requiredTrue') ? '' : 'You must agree to the terms';
    }
  }

  processHierarchicalSelections(): void {
    // Sort selections by path
    this.sectors.sort((a, b) => a.nodePath.localeCompare(b.nodePath));

    const hierarchicalOptions: any[] = [];

    this.sectors.forEach(selection => {
      const parts = selection.nodePath.split('/');
      const depth = parts.length - 3; // Calculate depth based on slashes (subtract 3 for top-level)

      const option = {
        nodeName: "&nbsp;".repeat(depth * 4) + selection.nodeName,
        nodeValue: selection.nodeValue,
      };
      hierarchicalOptions.push(option);
    });

    this.sectors = hierarchicalOptions;
  }
}
