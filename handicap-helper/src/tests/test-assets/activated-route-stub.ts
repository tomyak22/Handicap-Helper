import {
  DefaultUrlSerializer,
  convertToParamMap,
  ParamMap,
  Params,
  UrlSegment,
  UrlSegmentGroup,
  PRIMARY_OUTLET
} from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with `paramMap` and 'url' observables.
 * @example
 * // Sets url to categories/featured and param map to slug: 'featured'.
 * const route = new ActivatedRouteStub();
 * route.set('categories/:slug', {slug: 'featured'});
*/
export class ActivatedRouteStub {

  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` and 'url' observables
  private paramMapSubject = new ReplaySubject<ParamMap>();
  private urlSubject = new ReplaySubject<UrlSegment[]>();
  private paramsSubject = new ReplaySubject<Params>();

  constructor() { }

  /** The mock paramMap observable */
  readonly paramMap = this.paramMapSubject.asObservable();
  readonly params = this.paramsSubject.asObservable();

  /** The mock url observable */
  readonly url = this.urlSubject.asObservable();

  /**
   * Set the route and params of the active route
   * The function will identify any values in the given URL that start with a
   * colon (indicating a URL parameter) and swap it out for the value provided
   * in the params argument. It then uses Angular Routers default serialiser to
   * build a UrlTree. Params are also converted to Angulars ParamMap.
  */
  set(route: string, params: Params = {}) {

    const parts = route.split('/');
    const url = [];

    // For each part of the URL, if it starts with a colon,
    // replace it with the corresponding entry in the params object.
    for (let index = 0; index < parts.length; index++) {
      let part = parts[index];
      if (part.startsWith(':')) {
        part = params[part.substring(1)];
      }
      url.push(part);
    }

    const urlSerializer = new DefaultUrlSerializer();
    const tree = urlSerializer.parse(url.join('/'));
    const group: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    const segments: UrlSegment[] = group.segments;

    this.urlSubject.next(segments);
    this.paramMapSubject.next(convertToParamMap(params));
    this.paramsSubject.next(params);

  }

}
