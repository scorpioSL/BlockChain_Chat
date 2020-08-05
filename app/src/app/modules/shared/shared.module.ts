import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, AutocompleteLibModule],
  exports: [CommonModule, FormsModule, AutocompleteLibModule],
})
export class SharedModule {}
