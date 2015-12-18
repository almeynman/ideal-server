import forward from './forwardToServerModel';

function byIdGenerator(name) {
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

export default byIdGenerator;
