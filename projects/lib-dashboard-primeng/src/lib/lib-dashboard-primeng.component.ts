import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'lib-dashboard-primeng',
  template: `
  <div #tb style="height: 100%" [ngSwitch]="chartConfig.chartType">
    <div *ngSwitchCase="'searchbar'" class="ui-g ui-fluid">
      <div class="ui-g-12 ui-md-12">
          <div class="ui-inputgroup">
            <textarea type="text" pInputTextarea autoResize="true" style="width: 90%" [rows]="chartConfig.rows" [placeholder]="chartConfig.emptyText" 
            (blur)="searchQueryChange.emit(searchQuery);"
            [(ngModel)]="searchQuery"></textarea> <!-- (blur)="triggerEvent({data: chartConfig.value})" (keyup.enter)="triggerEvent({data: chartConfig.value})" -->
            <button pButton type="button" [label]="chartConfig.buttonText" (click)="triggerEvent({data: searchQuery})"></button>
          </div>
      </div>
    </div>
    <div *ngSwitchCase="'single'" class="ui-g ui-fluid">
      <div class="ui-g-12 ui-md-12" style="text-align: center; position: absolute">
          <div class="ui-inputgroup" style="align-items: baseline; display: contents">
            <span [ngStyle]="{'font-size': chartConfig['font-size'], 'font-weight': chartConfig['font-weight']}">{{getSingleStat()}}</span>
            <label>{{chartConfig.seriesName}}</label>
          </div>
      </div>
    </div>
    <div *ngSwitchCase="'timerange'" class="ui-g ui-fluid">
      <div class="ui-g-12 ui-md-10">
        <div class="ui-inputgroup">
          <label style="padding-right: 10px; width: 20%">{{chartConfig.label}}</label>
          <p-calendar [ngStyle]="{'width': '80%'}" [(ngModel)]="timeWindow" selectionMode="range" [showTime]="true"
            (onClose)="timeWindowChange.emit(timeWindow); triggerEvent({data: timeWindow})"
            [readonlyInput]="false" [showIcon]="true" [appendTo]="'body'"> <!-- (onClose)="dateRange.length === 2 ? triggerEvent({data: dateRange}) : undefined" -->
          </p-calendar>
        </div>
      </div>
    </div>
    <p-table *ngSwitchCase="'table'" #dt [columns]="chartConfig.columns" [value]="dataset.source" [rowsPerPageOptions]="chartConfig.rowsPerPageOptions" [responsive]="true"
          [paginator]="chartConfig.pagination" [paginatorPosition]="chartConfig.paginatorPosition" [alwaysShowPaginator]="chartConfig.alwaysShowPaginator" [autoLayout]="chartConfig.autoLayout"
          [showCurrentPageReport]="chartConfig.showCurrentPageReport" currentPageReportTemplate="Showing {{getFirst()}} to {{getLast()}} of {{dataset.source.length}} records"
          [rows]="chartConfig.pageSize" [resizableColumns]="chartConfig.resizableColumns"
          [scrollable]="chartConfig.scrollable" [style]="getTableStyle()" [scrollHeight]="getScrollHeight()" scrollWidth="100%">
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
                    <span style="word-break: break-all">{{row[col.field]}}</span>
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

  @Input()
  searchQuery: string;

  @Output()
  searchQueryChange: EventEmitter<any> = new EventEmitter<any> ();

  @Input()
  timeWindow: any[]

  @Output()
  timeWindowChange: EventEmitter<any> = new EventEmitter<any> ();

  @Output()
  onEvent: EventEmitter<any> = new EventEmitter<any> ();

  tableHeight;

  dateRange: Date[];

  @ViewChild('tb', {static: true})
  myIdentifier: ElementRef;

  private tableRef: Table;

  @ViewChild('dt', {static: false}) set content(content: Table) {
    if(content) {
        this.tableRef = content;
    }
 }
  

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tableHeight = this.myIdentifier.nativeElement.offsetHeight + "px";

    if (this.chartConfig.chartType === 'timerange') {
      if (this.timeWindow && this.timeWindow.length === 2) {
        this.timeWindow.map(v => new Date(v));
        this.timeWindowChange.emit(this.timeWindow);
        this.triggerEvent({data: this.timeWindow});
      }
      else if (this.chartConfig.defaultValue) {
        const rx = /NOW-(\d+)(\w)/;
        const vals: any[] = rx.exec(this.chartConfig.defaultValue)
        if (vals && vals.length === 3) {
          this.timeWindow = [];
          const now: Date = new Date();
          const then: Date = new Date(now);

          switch (vals[2]) {
            case 'm' :
              then.setMinutes(now.getMinutes() - vals[1])
              this.timeWindow.push(then);
              break;
            case 'h' :
                then.setHours(now.getHours() - vals[1])
                this.timeWindow.push(then);
                break;
            case 's' :
                then.setSeconds(now.getSeconds() - vals[1])
                this.timeWindow.push(then);
                break;
          }

          this.timeWindow.push(now);

          this.timeWindowChange.emit(this.timeWindow);
          this.triggerEvent({data: this.timeWindow});
        }
      }
    }

    if (this.searchQuery && this.timeWindow && this.timeWindow.length === 2) {
      this.triggerEvent({data: {}});
    }
  }

  getScrollHeight() {
    return (this.myIdentifier.nativeElement.offsetHeight - (this.chartConfig.columnSearch ? 200 : 150)) + "px";
  }

  getTableStyle() {
    return {width:'100%', 'height': (this.myIdentifier.nativeElement.offsetHeight) + "px"}
  }

  triggerEvent(data) {
    this.onEvent.emit(data);
  }

  getSingleStat() {
    if (!this.dataset.source || !this.dataset.source[0]) {
      return 0;
    }

    return this.dataset.source[0][this.dataset.dimensions[0]];
  }

  getFirst(): string {
    return this.tableRef ? String(this.tableRef._first + 1) : "";
  }

  getLast(): string {
    return this.tableRef ? String(Math.min(this.tableRef._first + this.tableRef.rows, this.dataset.source.length)) : "";
  }

}
