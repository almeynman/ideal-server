import forward from './forwardToServerModel';

export function byIdRoutes(model) {
  const name = model.plural;
  return [
    {
      route: `${name}ById[{keys:ids}][{keys:fields}]`,
      get(pathSet) {
        return forward.call(this, pathSet);
      }
    },
    {
      route: `${name}ById[{keys:ids}][{keys:hasManyFields}][{keys:filtersAndSorts}].edges[{integers:range}]`, // .comments.edges[{integers:commentRange}]
      get(pathSet) {
        return forward.call(this, pathSet);
      }
    },
    // {
    //   route: `${entityPlural}ById[{keys:ids}][{keys:fields}].edges[{integers:commentRange}]`, // .comments.edges[{integers:commentRange}]
    //   get(pathSet) {
    //     return forward.call(this, pathSet);
    //   }
    // },
    {
      route: `${name}ById[{keys:ids}][{keys:hasManyFields}][{keys:filtersAndSorts}].count`, // .comments.count
      get(pathSet) {
        let filterAndSortToSubstitute = false;
        pathSet.filtersAndSorts = pathSet.filtersAndSorts.map(filterAndSort => {
          if (filterAndSort.indexOf('{{me}}') > -1) {
            filterAndSort = filterAndSort.replace('{{me}}', this.userId);
          }
          // TODO what if several filtersAndSorts have {{this.id}}
          if (filterAndSort.indexOf('{{this.id}}' > -1)) {
            filterAndSortToSubstitute = filterAndSort
          }
          return filterAndSort;
        }).filter(filterAndSort => filterAndSort.indexOf('{{this.id}}') < 0);
        if (filterAndSortToSubstitute) {
          pathSet.filtersAndSorts = pathSet.ids.
            map(id => filterAndSortToSubstitute.replace('{{this.id}}', id)).
            concat(pathSet.filtersAndSorts)
        }
        return forward.call(this, pathSet);
      }
    }
    // {
    //   route: `${entityPlural}ById[{keys:ids}][{keys:fields}].count`, // .comments.count
    //   get(pathSet) {
    //     return forward.call(this, pathSet);
    //   }
    // }
    // TODO: ${entityPlural}ById[{keys:ids}][{keys:fields}][{keys:fieldProps}] https://github.com/Netflix/falcor/issues/673
  ];
}

export function clientRoutesFromModels(thinky) {
  const result = [];
  const models = thinky.models;
  for (const modelName in models) {
    // eliminate join tables
    if (!modelName.includes('_')) {
      const model = models[modelName];
      result.push(...byIdRoutes(model));
    }
  }
  return result;
}
