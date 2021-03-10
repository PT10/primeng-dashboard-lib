import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-dashboard-primeng',
  template: `
  <div #tb style="height: 100%" [ngSwitch]="chartConfig.chartType">
    <p-table *ngSwitchCase="'table'" #dt [columns]="chartConfig.columns" [value]="dataset.source"
          [paginator]="chartConfig.pagination" [rows]="chartConfig.pageSize" [resizableColumns]="true"
          [scrollable]="true" [style]="getTableStyle()" [scrollHeight]="getScrollHeight()">
          <ng-template *ngIf="chartConfig.globalSearch" pTemplate="caption">
            <div style="text-align: right">
                <i class="fa fa-search" style="margin:4px 4px 0 0"></i>
                <input pInputText type="text" size="50" placeholder="Search"
                  (input)="dt.filterGlobal($event.target.value, 'contains');" style="width:auto">
            </div>
        </ng-template>
          <ng-template pTemplate="colgroup" let-columns>
              <colgroup>
                  <col *ngFor="let col of columns" [style.width]="col.width">
              </colgroup>
          </ng-template>
          <ng-template pTemplate="header" let-columns>
              <tr>
                <th *ngFor="let col of columns" pResizableColumn [pSortableColumn]="col.sortable ? col.field : undefined">
                    {{col.header}}
                    <p-sortIcon *ngIf="col.sortable" [field]="col.field" ariaLabel="Activate to sort"
                    ariaLabelDesc="Activate to sort in descending order"
                    ariaLabelAsc="Activate to sort in ascending order"></p-sortIcon>
                </th>
              </tr>
              <tr *ngIf="chartConfig.columnSearch">
                <th *ngFor="let col of columns">
                  <input *ngIf="col.searchable" type="text"
                     class="form-control"
                    (input)="dt.filter($event.target.value, col.field, 'contains')">
                </th>
              </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row let-i="rowIndex">
              <tr>
                  <td *ngFor="let col of chartConfig.columns">
                    <span>{{row[col.field]}}</span>
                  </td>

              </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage" let-columns>
              <tr>
                  <td [attr.colspan]="columns ? columns.length : 4">
                      No records found
                  </td>
              </tr>
          </ng-template>
        </p-table>
</div>
  `,
  styles: []
})
export class LibDashboardPrimengComponent implements OnInit, AfterViewInit {

  @Input()
  chartConfig;

  @Input()
  dataset;

  tableHeight;

  @ViewChild('tb', {static: true})
  myIdentifier: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tableHeight = this.myIdentifier.nativeElement.offsetHeight + "px";
  }

  getScrollHeight() {
    return (this.myIdentifier.nativeElement.offsetHeight - (this.chartConfig.columnSearch ? 200 : 150)) + "px";
  }

  getTableStyle() {
    return {width:'100%', 'height': (this.myIdentifier.nativeElement.offsetHeight) + "px"}
  }

}