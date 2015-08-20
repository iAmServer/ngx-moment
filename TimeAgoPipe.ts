/* angular2-moment / v0.0.1 / (c) 2015 Uri Shaked / MIT Licence */

/// <reference path="node_modules/angular2/angular2.d.ts" />

import {Pipe, PipeFactory} from 'angular2/angular2';
import * as moment from 'moment';

export class TimeAgoPipe implements Pipe {
  private _currentTimer: number;
  
  constructor(private _cdRef) {
  }
  
  supports(value:any): boolean {
    return value instanceof Date || moment.isMoment(value);
  }
  
  transform(value: Date | moment.Moment, args?: List<any>): any {
    let momentInstance = moment(value);
    this._removeTimer();
    let timeToUpdate = this._getSecondsUntilUpdate(momentInstance) * 1000;
    this._currentTimer = setTimeout(() => this._cdRef.requestCheck(), timeToUpdate);
    return moment(value).from(moment());
  }
  
  onDestroy(): void {
    this._removeTimer();
  }
  
  _removeTimer() {
    if (this._currentTimer) {
      clearTimeout(this._currentTimer);
      this._currentTimer = null;
    }
  }
  
  _getSecondsUntilUpdate(momentInstance: moment.Moment) {
    var howOld = Math.abs(moment().diff(momentInstance, 'minute'));
    if (howOld < 1) {
      return 1;
    } else if (howOld < 60) {
      return 30;
    } else if (howOld < 180) {
      return 300;
    } else {
      return 3600;
    }
  }
}

export class TimeAgoPipeFactory implements PipeFactory {
  supports(value:any): boolean {
    return value instanceof Date || moment.isMoment(value);
  }
  create(cdRef): Pipe {
    return new TimeAgoPipe(cdRef);
  }
}

export var timeAgoPipe = [ new TimeAgoPipeFactory() ];