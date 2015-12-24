import Router from 'falcor-router';
import { Observable } from 'rx';
import { routesFromModels } from './generator';
import thinky from '../db-model';
import falcor from 'falcor';

const $ref = falcor.Model.ref;

export default Router.createClass([
  ...routesFromModels(thinky),
  {
    route: 'featuredDeals[{integers:range}]',
    get({ range }) {
      return Observable.fromPromise(
        thinky.models.Deal.orderBy(
          thinky.r.desc(row => {
            return row('payout').add(row('discount')).div(row('watchCount').add(thinky.r.expr(1)));
          })
        ).pluck('id').skip(range[0]).limit(range[range.length - 1] + 1)
      ).
      flatMap(docs =>
        Observable.from(docs.map((doc, i) =>
          ({ doc, i }))
        )
      ).
      map(({ doc, i }) => ({
        path: ['featuredDeals', range[i]],
        value: $ref(['dealsById', doc.id])
      }));
    }
  },
  {
    route: 'tagsByText[{keys:text}][{integers:range}]',
    get({ text, range }) {
      // TODO do I need multiple texts? text[0]
      // TODO orderBy rank/number of deals
      return Observable.fromPromise(
        thinky.models.Tag.filter(doc => doc('text').match(text[0])).
          skip(range[0]).limit(range[range.length - 1] + 1)
      ).flatMap(docs =>
        Observable.from(docs.map((doc, i) =>
          ({ doc, i })
        ))
      ).
      map(({ doc, i }) => ({
        path: ['tagsByText', text, range[i]],
        value: $ref(['tagsById', doc.id])
      }));
    }
  }
]);
