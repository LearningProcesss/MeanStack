import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatInputModule, MatCardModule, MatExpansionModule, MatProgressSpinnerModule, MatButtonModule, MatToolbarModule, MatDialogModule } from "@angular/material";


@NgModule({
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  declarations: [

  ],
  exports: [
    CommonModule,
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule { }
