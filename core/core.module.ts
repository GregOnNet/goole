import { NgModule } from '@angular/core';

import { Inspector } from './route-tree/inspector';
import { RouteTreeBuilder } from './route-tree/route-tree-builder';
import { SegmentMatcher } from './route-tree/segment-matcher';

@NgModule({
  providers: [Inspector, RouteTreeBuilder, SegmentMatcher]
})
export class CoreModule { }
