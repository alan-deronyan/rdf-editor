/*
 *  This file is part of the OpenLink RDF Editor
 *
 *  Copyright (C) 2014-2022 OpenLink Software
 *
 *  This project is free software; you can redistribute it and/or modify it
 *  under the terms of the GNU General Public License as published by the
 *  Free Software Foundation; only version 2 of the License, dated June 1991.
 *
 *  This program is distributed in the hope that it will be useful, but
 *  WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 *  General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 *
 */

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function(str) {
    return this.indexOf(str) == 0;
  };
}

if(!window.RDFE)
  window.RDFE = {};

RDFE.prefixes = {};
RDFE.prefixes['adms'] = 'http://www.w3.org/ns/adms#';
RDFE.prefixes['annotation'] = 'http://www.w3.org/2000/10/annotation-ns#';
RDFE.prefixes['atom'] = 'http://atomowl.org/ontologies/atomrdf#';
RDFE.prefixes['bibo'] = 'http://purl.org/ontology/bibo/';
RDFE.prefixes['book'] = 'http://purl.org/NET/book/vocab#';
RDFE.prefixes['cc'] = 'http://web.resource.org/cc/';
RDFE.prefixes['cert'] = 'http://www.w3.org/ns/auth/cert#';
RDFE.prefixes['dataview'] = 'http://www.w3.org/2003/g/data-view#';
RDFE.prefixes['dbpedia'] = 'http://dbpedia.org/resource/';
RDFE.prefixes['dc'] = 'http://purl.org/dc/elements/1.1/';
RDFE.prefixes['dcam'] = 'http://purl.org/dc/dcam/';
RDFE.prefixes['dcterms'] = 'http://purl.org/dc/terms/';
RDFE.prefixes['dctype'] = 'http://purl.org/dc/dcmitype/';
RDFE.prefixes['doap'] = 'http://usefulinc.com/ns/doap#';
RDFE.prefixes['foaf'] = 'http://xmlns.com/foaf/0.1/';
RDFE.prefixes['fresnel'] = 'http://www.w3.org/2004/09/fresnel#';
RDFE.prefixes['geo'] = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
RDFE.prefixes['gr'] = 'http://purl.org/goodrelations/v1#';
RDFE.prefixes['gso'] = 'http://www.w3.org/ns/adms#';
RDFE.prefixes['ibis'] = 'http://purl.org/ibis#';
RDFE.prefixes['ical'] = 'http://www.w3.org/2002/12/cal/icaltzd#';
RDFE.prefixes['like'] = 'http://ontologi.es/like#';
RDFE.prefixes['mo'] = 'http://purl.org/ontology/mo/';
RDFE.prefixes['owl'] = 'http://www.w3.org/2002/07/owl#';
RDFE.prefixes['rdf'] = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
RDFE.prefixes['rdfs'] = 'http://www.w3.org/2000/01/rdf-schema#';
RDFE.prefixes['rev'] = 'http://purl.org/stuff/rev#';
RDFE.prefixes['rss'] = 'http://purl.org/rss/1.0/';
RDFE.prefixes['schema'] = 'http://schema.org/';
RDFE.prefixes['scot'] = 'http://scot-project.org/scot/ns';
RDFE.prefixes['sioc'] = 'http://rdfs.org/sioc/ns#';
RDFE.prefixes['sioct'] = 'http://rdfs.org/sioc/types#';
RDFE.prefixes['skos'] = 'http://www.w3.org/2004/02/skos/core#';
RDFE.prefixes['vcard'] = 'http://www.w3.org/2006/vcard/ns#';
RDFE.prefixes['void'] = 'http://rdfs.org/ns/void#';
RDFE.prefixes['vs'] = 'http://www.w3.org/2003/06/sw-vocab-status/ns#';
RDFE.prefixes['wot'] = 'http://xmlns.com/wot/0.1/';
RDFE.prefixes['wdrs'] = 'http://www.w3.org/2007/05/powder-s#';
RDFE.prefixes['ws'] = 'http://www.w3.org/ns/pim/space#';
RDFE.prefixes['xhtml'] = 'http://www.w3.org/1999/xhtml';
RDFE.prefixes['xsd'] = 'http://www.w3.org/2001/XMLSchema#';

/*
 *
 * Returns first non null argument
 *
 */
RDFE.coalesce = function() {
  for (var i = 0; i < arguments.length; i++) {
    if ((typeof arguments[i] !== 'undefined') && (arguments[i] !== null)) {
      return arguments[i];
    }
  }
};

/*
 *
 * Extract a prefix
 *    foaf:Person => foaf
 *
 */
RDFE.uriPrefix = function(v) {
  var m = Math.max(v.lastIndexOf(':'), v.lastIndexOf('/'), v.lastIndexOf('#'));
  if ((m != -1) && (m == v.lastIndexOf(':'))) {
    return v.substring(0, m);
  }
  /*
  if (m == -1) {
    return v;
  }
  */
  return null;
};

/*
 *
 * Extract a label
 *    http://xmlns.com/foaf/0.1/Person => Person
 *    foaf:Person => Person
 *
 */
RDFE.uriLabel = function(v) {
  var m = Math.max(v.lastIndexOf(':'), v.lastIndexOf('/'), v.lastIndexOf('#'));
  if (m == -1) {
    return v;
  }
  if (m != v.length-1) {
    return v.substring(m+1);
  }
  return null;
};

/*
 *
 * Check for prefix
 *    foaf
 *
 */
RDFE.isUriPrefix = function(v) {
  return (Math.max(v.lastIndexOf(':'), v.lastIndexOf('/'), v.lastIndexOf('#')) == -1);
};

/*
 *
 * Extract an ontology
 *    http://xmlns.com/foaf/0.1/Person => http://xmlns.com/foaf/0.1/
 *
 */
RDFE.uriOntology = function(v) {
  if(!v)
    return null;
  var m = Math.max(v.lastIndexOf(':'), v.lastIndexOf('/'), v.lastIndexOf('#'));
  if (m != -1) {
    return v.substring(0, m + 1);
  }
  return null;
};

/*
 *
 * Check for blank node - starting with '_:...'
 *
 */
RDFE.isBlankNode = function(v) {
  if (_.isString(v))
    return (v.match(/^\_\:*/)) ? true : false;

  if (_.isObject(v) && v.URI)
    return RDFE.isBlankNode(v.URI);

  return false;
};

/*
 *
 * Find ontology by prefix
 *
 */
RDFE.ontologyByPrefix = function(prefix, callback) {
  var host = location.protocol+'//prefix.cc/{0}.file.json'.format(prefix);
  $.ajax({
    "url": host,
    "type": 'GET',
    "async": (callback)? true: false
  }).done(function(data) {
    RDFE.prefixes[prefix] = data[prefix];
    if (callback) {
      callback(data[prefix]);
    }
  });
  return RDFE.prefixes[prefix];
};

/*
 *
 * Find ontology by prefix
 *
 */
RDFE.prefixByOntology = function(uri, callback) {
  uri = RDFE.Utils.trim(uri, '#');
  var host = 'https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/autocomplete?q='+encodeURIComponent(uri);

  $.ajax({
    "url": host,
    "type": 'GET',
    "dataType": "json",
    "async": (callback)? true: false
  }).done(function(data) {
    var results = data.results;
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      for (var j = 0; j < result.uri.length; j++) {
        if (RDFE.Utils.trim(result.uri[j], '#') === uri) {
          if (callback) {
            callback(result.prefix[j]);
          }
          return;
        }
      }
    }
  });
};

/*
 *
 * Find ontology by prefix
 *
 */
RDFE.schema2ontology_range = function(range) {
  var v = range;

  if (range === 'http://schema.org/Boolean') {
    v = 'http://www.w3.org/2001/XMLSchema#boolean';
  }
  else if (range === 'http://schema.org/Date') {
    v = 'http://www.w3.org/2001/XMLSchema#boolean';
  }
  else if (range === 'http://schema.org/DateTime') {
    v = 'http://www.w3.org/2001/XMLSchema#datetime';
  }
  else if (range === 'http://schema.org/Time') {
    v = 'http://www.w3.org/2001/XMLSchema#datetime';
  }
  else if (range === 'http://schema.org/Number') {
    v = 'http://www.w3.org/2001/XMLSchema#decimal';
  }
  else if (range === 'http://schema.org/Float') {
    v = 'http://www.w3.org/2001/XMLSchema#float';
  }
  else if (range === 'http://schema.org/Integer') {
    v = 'http://www.w3.org/2001/XMLSchema#integer';
  }
  else if (range === 'http://schema.org/Text') {
    v = 'http://www.w3.org/2001/XMLSchema#string';
  }
  else if (range === 'http://schema.org/URL') {
    v = 'http://www.w3.org/2001/XMLSchema#string';
  }
  return v;
};

/*
 *
 * Ontology Manager
 *
 */
RDFE.OntologyManager = function(config) {
  this.config = config || {};
  this.options = $.extend(RDFE.Config.defaults.ontology, this.config.ontology);

  this.reset();

  this.prefixes = $.extend({}, RDFE.prefixes, this.config.prefixes);
};

RDFE.OntologyManager.prototype.init = function(options) {
  var self = this;

  this.reset();

  var options = $.extend({}, options);
  var items = self.options.preloadOntologies || [];

  var fn = function (i, options) {
    if (i < items.length) {
      var item = items[i];
      var __callback = function (options, itemMessage) {
        return function () {
          $(self).trigger(itemMessage, [self, item]);
          fn(i+1, options);
        };
      };
      var params = {
        "success":  __callback(options, 'loadingFinished'),
        "error": __callback(options, 'loadingFailed')
      };
      // console.log('loading', item);
      $(self).trigger('loading', [self, item]);
      self.parseOntologyFile(item, params);
    } else {
      if (options.success) {
        options.success();
      }
    }
  };

  fn(0, options);
};

RDFE.OntologyManager.prototype.reset = function(options) {
  // ontologies
  this.ontologies = {};
  this.ontologyClasses = {};
  this.ontologyProperties = {};
  this.individuals = {};
  this.fresnelLenses = {};
};

RDFE.OntologyManager.prototype.prefixByOntology = function(url) {
  for (var prefix in this.prefixes) {
    if (this.prefixes[prefix] === url) {
      return prefix;
    }
  }
  return null;
};

/*
 *
 * Denormalize URI
 *     foaf:Person => http://xmlns.com/foaf/0.1/Person
 *
 */
RDFE.OntologyManager.prototype.uriDenormalize = function(v) {
  var prefix = RDFE.uriPrefix(v);
  if (prefix) {
    if (!this.prefixes[prefix]) {
      RDFE.ontologyByPrefix(prefix);
    }
    if (this.prefixes[prefix]) {
      return this.prefixes[prefix] + v.substring(prefix.length + 1);
    }
  }
  return v;
};

/*
 *
 * Normalize URI
 *    http://xmlns.com/foaf/0.1/Person => foaf:Person
 *
 */
RDFE.OntologyManager.prototype.uriNormalize = function(v, fb) {
  var ontology = RDFE.uriOntology(v);
  if (ontology) {
    for (var prefix in this.prefixes) {
      if (this.prefixes[prefix] == ontology) {
        return prefix + ':' + v.substring(ontology.length);
      }
    }
  }
  // nothing found, return the fallback, undefined by default
  return fb;
};

RDFE.OntologyManager.prototype.ontologiesAsArray = function() {
  return _.values(this.ontologies);
};

RDFE.OntologyManager.prototype.ontologyByURI = function(uri, create) {
  var o = this.ontologies[uri];
  if (!o && create === true) {
    o = new RDFE.Ontology(this, uri);
    this.ontologies[uri] = o;
  }
  return o;
};

RDFE.OntologyManager.prototype.ontologyByPrefix = function(prefix) {
  return this.ontologies[this.prefixes[prefix]];
};

RDFE.OntologyManager.prototype.ontologyRemove = function(URI) {
  var ontology = this.ontologyByURI(URI);
  if (ontology) {
    delete this.ontologies[URI];
    var c = ontology.classesAsArray();
    for (var i = 0; i < c.length; i++) {
      this.ontologyClassRemove(c[i].URI);
    }
    var p = ontology.allProperties();
    for (i = 0; i < p.length; i++) {
      this.ontologyPropertyRemove(p[i].URI);
    }

    $(this).trigger('changed', [ this ]);
  }
};

RDFE.OntologyManager.prototype.ontologyClassRemove = function(URI) {
  delete this.ontologyClasses[URI];
};

RDFE.OntologyManager.prototype.ontologyPropertyRemove = function(URI) {
  delete this.ontologyProperties[URI];
};

RDFE.OntologyManager.prototype.ontologyClassByURI = function(uri, create) {
  var c = this.ontologyClasses[uri];
  if(!c && create === true) {
    this.ontologyClasses[uri] = c = new RDFE.OntologyClass(this, uri);
    c.ontology = this.ontologyByURI(RDFE.uriOntology(uri), true);
    c.ontology.classes[uri] = c;
  }
  return c;
};

RDFE.OntologyManager.prototype.ontologyPropertyByURI = function(uri, create) {
  var self = this;
  var p = this.ontologyProperties[uri];

  if(!p && create === true) {
    p = new RDFE.OntologyProperty(self, uri);
    self.ontologyProperties[uri] = p;
    p.ontology = self.ontologyByURI(RDFE.uriOntology(uri), true);
    p.ontology.properties[uri] = p;
  }
  return p;
};

RDFE.OntologyManager.prototype.individualByURI = function(URI) {
  return this.individuals[URI];
};

RDFE.OntologyManager.prototype.suportedContentTypes = function(contentType) {
  var self = this;

  if (self.suportedTurtleTypes(contentType))
    return true;

  if (self.suportedRDFTypes(contentType))
    return true;

  if (self.suportedJSONTypes(contentType))
    return true;

  return false;
};

RDFE.OntologyManager.prototype.suportedTurtleTypes = function(contentType) {
  if (contentType.indexOf('text/turtle') != -1)
    return true;

  if (contentType.indexOf('application/turtle') != -1)
    return true;

  if (contentType.indexOf('application/x-turtle') != -1)
    return true;

  if (contentType.indexOf('application/trig') != -1)
    return true;

  if (contentType.indexOf('application/n-triples') != -1)
    return true;

  if (contentType.indexOf('application/n-quads') != -1)
    return true;

  if (contentType.indexOf('text/n3') != -1)
    return true;

  return false;
};

RDFE.OntologyManager.prototype.suportedRDFTypes = function(contentType) {
  if (contentType.indexOf('application/rdf+xml') != -1)
    return true;

  if (contentType.indexOf('text/rdf') != -1)
    return true;

  return false;
};

RDFE.OntologyManager.prototype.suportedJSONTypes = function(contentType) {
  if (contentType.indexOf('application/ld+json') != -1)
    return true;

  if (contentType.indexOf('application/json') != -1)
    return true;

  return false;
};

RDFE.OntologyManager.prototype.load = function(URI, params) {
  var self = this;

  var ioType = (params.ioType)? params.ioType: 'http';
  var uriProtocol = RDFE.Utils.getProtocol(URI);
  var options = {};
  if (self.options.nonTTLProxyUrl) {
    options.httpProxyTemplate = self.options.nonTTLProxyUrl[document.location.protocol];
  }
  var IO = RDFE.IO.createIO(ioType, options);
  IO.type = ioType;

  params.__success = params.success;
  params.success = function(data, status, xhr) {
    if (((uriProtocol === 'http:') || (uriProtocol === 'https:')) && self.options.nonTTLProxy && (self.options.proxy !== self.options.nonTTLProxy)) {
      var contentType = (xhr.getResponseHeader('content-type') || '').split(';')[0];
      if (!self.suportedContentTypes(contentType)) {
        IO.retrieve(URI, $.extend({"proxy": self.options.nonTTLProxy}, params));

        return;
      }
    }
    if (params.__success) {
      params.__success(data, status, xhr);
    }
  };
  params.__error = params.error;
  params.error = function(state, data, status, xhr) {
    if ((xhr.status !== 404) && ((uriProtocol === 'http:') || (uriProtocol === 'https:')) && self.options.nonTTLProxy && (self.options.proxy !== self.options.nonTTLProxy)) {
      params.error = params.__error;
      IO.retrieve(URI, $.extend({"proxy": self.options.nonTTLProxy}, params));

      return;
    }
    if (params.__error)
      params.__error(state, data, status, xhr);
  };
  params = $.extend({"noWebIDTLS": true}, params);
  var proxy = ((uriProtocol !== document.location.protocol) && (document.location.protocol === 'https:')) ? true: self.options.proxy;
  IO.retrieve(URI, $.extend({"proxy": proxy}, params));
};

RDFE.OntologyManager.prototype.parseOntologyFile = function(URI, params) {
  var self = this,
      uriProtocol = RDFE.Utils.getProtocol(URI),
      labels = {}, // maps uris to labels
      comments = {}, // maps uris to comments
      restrictions = {}, // maps blank nodes to restriction details
      restrictionMap = {}, // maps class uri to restriction blank node
      collections = {}, // maps collection nodes
      lenses = {}; // the parsed fresnel lenses


  function findOrCreateOntology(uri) {
    return self.ontologyByURI(uri, true);
  }

  function findOrCreateClass(uri) {
    if (N3.Util.isBlank(uri)) {
      return null;
    }

    return self.ontologyClassByURI(uri, true);
  }

  function findOrCreateProperty(uri) {
    if (N3.Util.isBlank(uri)) {
      return null;
    }
    return self.ontologyPropertyByURI(uri, true);
  }

  function findOrCreateIndividual(uri) {
    return (self.individuals[uri] = self.individuals[uri] || new RDFE.OntologyIndividual(self, uri));
  }

  function findOrCreateLens(uri) {
    return (lenses[uri] = lenses[uri] || new RDFE.FresnelLens(self, uri));
  }

  var resolveLabel = function(uri, label) {
    var v;

    if (v = self.ontologyProperties[uri]) {
      v.label = v.label || label;
    }
    else if (v = self.ontologyClasses[uri]) {
      v.label = v.label || label;
    }
    else if (v = self.ontologies[uri]) {
      v.label = v.label || label;
    }
    else if (v = self.individuals[uri]) {
      v.label = v.label || label;
    }
    else if (v = lenses[uri]) {
      v.label = v.label || label;
    }
    else {
      labels[uri] = label;
    }
  };

  var resolveComment = function(uri, comment) {
    var v;

    if (v = self.ontologyProperties[uri]) {
      v.comment = v.comment || comment;
    }
    else if (v = self.ontologyClasses[uri]) {
      v.comment = v.comment || comment;
    }
    else if (v = self.ontologies[uri]) {
      v.comment = v.comment || comment;
    }
    else if (v = self.individuals[uri]) {
      v.comment = v.comment || comment;
    }
    else if (v = lenses[uri]) {
      v.comment = v.comment || comment;
    }
    else {
      comments[uri] = comment;
    }
  };

  /**
   * Resolve an rdf collection for a given node uri (typically a blank node)
   * using the relations in @p collections.
   */
  function resolveCollection(uri) {
    var r = [];
    var cur = uri;

    while (cur) {
      var curNode = collections[cur];
      if (curNode) {
        if (curNode.first) {
          r.push(curNode.first);
        }
        cur = curNode.rest;
      }
      else {
        cur = null;
      }
    }
    return r;
  }

  // handle a single triple from the N3 parser
  var handleTriple = function(triple) {
    var s = triple.subject,
        p = triple.predicate,
        o = triple.object;

    // handle the type triples
    if (p === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
      switch(o) {
        case 'http://www.w3.org/2002/07/owl#ObjectProperty':
        case 'http://www.w3.org/2002/07/owl#DatatypeProperty':
        case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property':
          findOrCreateProperty(s);
          break;

        case 'http://www.w3.org/2000/01/rdf-schema#Class':
        case 'http://www.w3.org/2002/07/owl#Class':
          findOrCreateClass(s);
          break;

        case 'http://www.w3.org/2002/07/owl#Restriction':
          restrictions[s] = restrictions[s] || {};
          break;

        case 'http://www.openlinksw.com/ontology/oplowl#AggregateRestriction':
          restrictions[s] = restrictions[s] || {};
          restrictions[s].isAggregate = true;
          break;

        case 'http://www.openlinksw.com/ontology/oplowl#UniqueIdRestriction':
          restrictions[s] = restrictions[s] || {};
          restrictions[s].isUniqueId = true;
          break;

        case 'http://www.w3.org/2004/09/fresnel#Lens':
          findOrCreateLens(s);
          break;
      }

      // any other type is an individual to us
      var individual = findOrCreateIndividual(s),
          individualClass = findOrCreateClass(o);
      individual.type = individualClass;
      individualClass.individuals[s] = individual;
    }

    else if (p === 'http://www.w3.org/2000/01/rdf-schema#label') {
      resolveLabel(s, N3.Util.getLiteralValue(o));
    }

    else if (p === 'http://www.w3.org/2000/01/rdf-schema#comment') {
      resolveComment(s, N3.Util.getLiteralValue(o));
    }

    else if (p === 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
      var cc = findOrCreateClass(s);
      if (N3.Util.isBlank(o)) {
        // remember blank node for restriction handling later
        var r = restrictionMap[s] = restrictionMap[s] || [];
        r.push(o);
      }
      else {
        pc = findOrCreateClass(o)
        cc.subClassOf.push(pc);
        pc.superClassOf.push(cc);
      }
    }

    else if (p === 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf') {
      var pc = findOrCreateProperty(o),
          cc = findOrCreateProperty(s);
      cc.subPropertyOf.push(pc);
      pc.superPropertyOf.push(cc);
    }

    else if (p === 'http://www.w3.org/2000/01/rdf-schema#domain' ||
             p === 'http://schema.org/domainIncludes') {
      var c = findOrCreateProperty(s);
      if (N3.Util.isBlank(o)) {
        // postpone the collection query for later
        c.domain.push(o);
      }
      else {
        c.domain.push(findOrCreateClass(o));
      }
    }

    else if (p === 'http://www.w3.org/2000/01/rdf-schema#range') {
      var c = findOrCreateProperty(s);

      c.range.push(o);
    }

    else if (p === 'http://schema.org/rangeIncludes') {
      var c = findOrCreateProperty(s);
      var r = RDFE.schema2ontology_range(o);

      c.range.push(r);
    }

    else if (p === 'http://www.w3.org/2002/07/owl#onProperty') {
      var r = restrictions[s] = restrictions[s] || {};
      (r.onProperty = r.onProperty || []).push(o);
    }

    else if (p === 'http://www.w3.org/2002/07/owl#cardinality' ||
             p === 'http://www.w3.org/2002/07/owl#maxCardinality' ||
             p === 'http://www.w3.org/2002/07/owl#minCardinality' ||
             p === 'http://www.openlinksw.com/ontology/oplowl#hasCustomLabel' ||
             p === 'http://www.openlinksw.com/ontology/oplowl#hasCustomComment') {
      var r = restrictions[s] = restrictions[s] || {};
      r[RDFE.uriLabel(p)] = N3.Util.getLiteralValue(o);
    }

    else if (p === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first' ||
             p === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest') {
      if (o !== 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil') {
        var c = collections[s] = collections[s] || {};
        c[RDFE.uriLabel(p)] = o;
      }
    }

    else if (p === 'http://www.w3.org/2002/07/owl#unionOf') {
      // poor-man's owl:unionOf handling which simply converts it to a plain rdf collection
      collections[s] = { rest: o };
    }

    else if (p === 'http://www.w3.org/2004/09/fresnel#showProperties' ||
             p === 'http://www.w3.org/2004/09/fresnel#hideProperties' ||
             p === 'http://www.w3.org/2004/09/fresnel#classLensDomain') {
      var f = findOrCreateLens(s);
      f[RDFE.uriLabel(p)] = o; // this will be resovled as a collection later
    }
  };

  // map the cached values in labels, comments, and restrictions to the previously parsed classes and properties
  var finishParse = function() {
    for (var uri in self.ontologyClasses) {
      var c = self.ontologyClasses[uri];

      c.label = c.label || labels[uri];
      c.comment = c.comment || comments[uri];
      delete labels[uri];
      delete comments[uri];

      var rm = restrictionMap[uri];
      if (rm) {
        for (var i = 0; i < rm.length; i++) {
          var r = restrictions[rm[i]];
          var rr = _.clone(r);
          for (var j = 0; j < r.onProperty.length; j++) {
            c.restrictions[r.onProperty[j]] = rr;
          }
          delete rr.onProperty;
        }
        delete restrictionMap[uri];
      }
    }

    for (var uri in self.ontologyProperties) {
      var p = self.ontologyProperties[uri];

      p.label = p.label || labels[uri];
      p.comment = p.comment || comments[uri];
      delete labels[uri];
      delete comments[uri];

      // resolve the range in case it is a collection (owl:UnionOf)
      var range = _.clone(p.range);
      p.range = [];
      for (var i = 0; i < range.length; i++) {
        if (N3.Util.isBlank(range[i])) {
          p.range = _.union(p.range, resolveCollection(range[i]));
        }
        else {
          p.range.push(range[i]);
        }
      }

      // we store the domain as a list
      var domain = _.clone(p.domain);
      p.domain = [];
      for (var i = 0; i < domain.length; i++) {
        if (!domain[i].URI && N3.Util.isBlank(domain[i])) {
          p.domain = _.union(p.domain, resolveCollection(domain[i]));
        }
        else {
          p.domain.push(domain[i]);
        }
      }
    }

    // assign lenses to classes
    for (uri in lenses) {
      var p = lenses[uri];

      p.label = p.label || labels[uri];
      p.comment = p.comment || comments[uri];
      delete labels[uri];
      delete comments[uri];

      p.showProperties = resolveCollection(p.showProperties);
      p.hideProperties = resolveCollection(p.hideProperties);

      self.fresnelLenses[uri] = p;

      if (p.classLensDomain) {
        findOrCreateClass(p.classLensDomain).fresnelLens = p;
      }
    }

    for (uri in self.ontologies) {
      // ontology URIs often are stripped of the trailing '#'
      var o = self.ontologies[uri];

      o.label = o.label || labels[uri] || labels[uri.substring(0, uri.length - 1)];
      o.comment = o.comment || comments[uri] || comments[uri.substring(0, uri.length - 1)];
      delete labels[uri];
      delete comments[uri];
    }

    for (uri in self.individuals) {
      var p = self.individuals[uri];
      // TODO: use config.labelProps for individuals
      p.label = p.label || labels[uri];
      p.comment = p.comment || comments[uri];
      delete labels[uri];
      delete comments[uri];
    }

    $(self).trigger('changed', [ self ]);
  };

  // parse the ttl gotten from the URI
  var parseTripels = function(data, status, xhr) {
    var turtleParser = function (data, parseParams, params) {
      // console.log(URI);
      var parser = N3.Parser(parseParams);
      parser.parse(data, function(error, triple) {
        if (error) {
          if (params.error) {
            params.error({"message": 'TTL parse error. ' + error.message});
          }
        }
        else if (!triple) {
          finishParse();
          if (params.success) {
            params.success();
          }
        }
        else {
          handleTriple(triple);
        }
      });
    };

    var rdfParser = function (data, params) {
      // console.log(URI);
      RDFXMLParser.parser.parse(data, {}, function(error, triples) {
        if (error) {
          if (params.error) {
            params.error({"message": 'RDF parse error. ' + error.message});
          }
        }
        else {
          for (var i = 0; i < triples.length; i++) {
            var triple = {
              "subject": triples[i].subject.value,
              "predicate": triples[i].predicate.value,
              "object": triples[i].object.value || triples[i].object.literal
            };
            handleTriple(triple);
          }
          finishParse();
          if (params.success) {
            params.success();
          }
        }
      });
    };

    var jsonParser = function (data, params) {
      // console.log(URI);
      try {
        var jsonData = JSON.parse(data);
        jsonld.normalize(jsonData, {}, function(error, normalized) {
          if (error) {
            if (params.error) {
              params.error({"message": 'JSON-LD parse error. ' + error.message});
            }
          }
          else {
            var parseTerm = function (term) {
              if (term.type === 'blank node') {
                return term.value;
              } else if (term.type === 'IRI') {
                return term.value;
              } else if (term.type === 'literal') {
                return '"' + term.value + '"';
              }
            };

            for (var p in normalized) {
              var triples = normalized[p];
              for (var i = 0; i < triples.length; i++) {
                var triple = {
                  "subject": parseTerm(triples[i].subject),
                  "predicate": parseTerm(triples[i].predicate),
                  "object": parseTerm(triples[i].object)
                };
                handleTriple(triple);
              }
            }
            finishParse();
            if (params.success) {
              params.success();
            }
          }
        });
      } catch (e) {
        if (params.error) {
          params.error({"message": 'JSON parse error. ' + e.message});
        }
      }

    };

    var contentType = (xhr.getResponseHeader('content-type') || '').split(';')[0];
    if ((contentType === 'text/plain') && (uriProtocol !== 'http:') && (uriProtocol !== 'https:'))
      contentType = 'text/turtle';

    if (self.suportedTurtleTypes(contentType)) {
      var parseParams = null;
      if (contentType.indexOf('text/n3') != -1)
        parseParams = {"format": 'text/n3'};

      return turtleParser (data, parseParams, params);
    }

    if (self.suportedRDFTypes(contentType)) {
      return rdfParser (data, params);
    }

    if (self.suportedJSONTypes(contentType)) {
      return jsonParser (data, params);
    }

    var message = 'Only Turtle files can be parsed in the ontology manager.'
    console.error(message);
    if (params.error)
      params.error({"message": message});
  };

  var loadParams = {
    "ioType": params.ioType,
    "success": parseTripels,
    "error": params.error
  };
  if (!URI.startsWith(RDFE.Utils.getUrlBase(URI))) {
    URI = RDFE.Utils.getUrl(URI);
  }
  self.load(URI, loadParams);
};

/**
 * Find a fresnel lens for the given @p domainURI.
 *
 * @return The fresnel lens for the given domain or one of its
 * superclasses or null if none was found.
 */
RDFE.OntologyManager.prototype.findFresnelLens = function(domainURI) {
  var c = this.ontologyClasses[domainURI];
  if(c) {
    return c.getFresnelLens();
  }
  return null;
};

RDFE.OntologyManager.prototype.ontologyDetermine = function(URI) {
  var self = this;
  var ontology;
  var prefix = RDFE.uriPrefix(URI);
  if (prefix) {
    ontology = self.ontologyByPrefix(prefix);
    if (ontology) {
      ontology = ontology.URI;
    } else {
      ontology = RDFE.ontologyByPrefix(prefix);
    }
  } else {
    ontology = RDFE.uriOntology(URI);
  }
  return ontology;
};

RDFE.OntologyManager.prototype.allOntologies = function() {
  return _.values(this.ontologies);
};

RDFE.OntologyManager.prototype.allClasses = function() {
  return _.values(this.ontologyClasses);
};

RDFE.OntologyManager.prototype.allProperties = function(domain) {
  var pl = [];
  for (var uri in this.ontologyProperties) {
    var p = this.ontologyProperties[uri];
    // FIXME: include super-classes for domain-check
    if(!domain || p.domain.indexOf(domain))
      pl.push(p);
  }
  return pl;
};

/**
 * Create a string representation of a list of type uris.
 *
 * The given list of @p types is converted into a comma-separated list of
 * type labels.
 *
 * @param types An array or class uris.
 * @param html If @p true then an html string will be retutned.
 */
RDFE.OntologyManager.prototype.typesToLabel = function(types, html) {
  var self = this;
  return _.uniq(_.map(types, function(s) {
    // merge class name with class labentity for the searchable entity type
    var c = self.ontologyClassByURI(s),
        l;
    if(c) {
      l = c.label;
    }
    else {
      l = RDFE.Utils.uri2name(s);
    }
    if(html) {
      return '<a href="' + s + '">' + l + '</a>';
    }
    else {
      return l;
    }
  })).join(', ');
};

/*
 *
 * Ontology
 *
 */
RDFE.Ontology = function(ontologyManager, URI, prefix, options) {
  // console.log('ontology =>', URI);
  var self = this;

  if (prefix && ontologyManager.prefixes[prefix] === URI)
    return null;

  self.options = $.extend({}, options);
  self.URI = URI;
  self.classes = {};
  self.properties = {};

  self.manager = ontologyManager;
  self.manager.ontologies[URI] = self;
  self.prefix = prefix || ontologyManager.prefixByOntology(URI);
  if (!self.prefix) {
    var callback = function(prefix) {
      if (prefix && !self.manager.prefixes[prefix]) {
        self.manager.prefixes[prefix] = URI;
        self.prefix = prefix;
        self.manager.prefixes[prefix] = URI;
      }
      $(self.manager).trigger('changed', [ self.manager ]);
    };
    RDFE.prefixByOntology(URI, callback);
  }
};

RDFE.Ontology.prototype.classesAsArray = function() {
  return _.values(this.classes);
};

RDFE.Ontology.prototype.classesLength = function() {
  return this.classesAsArray().length;
};

RDFE.Ontology.prototype.ontologyClassByURI = function(URI) {
  return this.classes[URI];
};

RDFE.Ontology.prototype.propertyByURI = function(URI) {
  return this.properties[URI];
};

RDFE.Ontology.prototype.propertiesLength = function() {
  return _.values(this.properties).length;
};

RDFE.Ontology.prototype.allProperties = function(domain) {
  var pl = [];
  for (var v in this.properties) {
    var p = this.properties[v];
    // FIXME: include super-classes for domain-check
    if (!domain || p.domain.indexOf(domain))
      pl.push(p);
  }
  return pl;
};

/*
 *
 * Ontology Class
 *
 */
RDFE.OntologyClass = function(ontologyManager, URI) {
  // console.log('class =>', URI);
  this.URI = URI;
  this.curi = ontologyManager.uriNormalize(URI);
  this.name = RDFE.Utils.uri2name(URI);
  this.subClassOf = [];
  this.superClassOf = [];
  this.disjointWith = [];
  this.properties = {};
  this.individuals = {};
  this.restrictions = {};

  this.manager = ontologyManager;
};

RDFE.OntologyClass.prototype.propertiesAsArray = function() {
  var self = this;
  var properties = [];
  for (var v in self.properties) {
    properties.push(self.properties[v]);
  }
  return properties;
};

/**
 * Find the max cardinality for the given property.
 *
 * Both super-classes and super-properties will be searched for the
 * max cardinality.
 */
RDFE.OntologyClass.prototype.maxCardinalityForProperty = function(p, cc) {
  var prop = this.restrictions[p],
      c = null;

  // check if this class has a cardinality itself
  if(prop) {
    c = prop.cardinality || prop.maxCardinality;
    if(c)
      return c;
  }

  // check if this class has a cardinality for any of the property's super-properties
  var property = this.manager.ontologyPropertyByURI(p);
  if (property) {
    var sp = property.getSuperProperties();
    for (var i = 0; i < sp.length; i++) {
      var sr = this.restrictions[sp[i].URI];
      if(sr) {
        c = sr.cardinality || sr.maxCardinality;
        if(c) {
          return c;
        }
      }
    }
  }

  // check super-classes (with loop-protection)
  for(var i = 0; i < this.subClassOf.length; i++) {
    var sc = this.subClassOf[i];
    if($.inArray(sc.URI, cc) < 0) {
      cc = cc || [];
      cc.push(sc.URI);
      c = sc.maxCardinalityForProperty(p, cc);
      if(c) {
        return c;
      }
    }
    else {
      console.log('CAUTION: Found sub-class loop in ', cc);
    }
  }

  return null;
};

RDFE.OntologyClass.prototype.isAggregateProperty = function(p, cc) {
  var prop = this.restrictions[p];

  // check if this class has a cardinality itself
  if(prop) {
    if(prop.isAggregate)
      return true;
  }

  // check super-classes (with loop-protection)
  for(var i = 0; i < this.subClassOf.length; i++) {
    var sc = this.subClassOf[i];
    if($.inArray(sc.URI, cc) < 0) {
      cc = cc || [];
      cc.push(sc.URI);
      if(sc.isAggregateProperty(p, cc)) {
        return true;
      }
    }
    else {
      console.log('CAUTION: Found sub-class loop in ', cc);
    }
  }

  return false;
};

RDFE.OntologyClass.prototype.getSubClasses = function(includeSuper, subClasses, checkedClasses) {
  subClasses = subClasses || [];
  subClasses = _.union(subClasses, this.superClassOf);
  if (includeSuper !== false) {
    checkedClasses = checkedClasses || [];
    checkedClasses.push(this.URI);
    for (var i = 0; i < this.superClassOf.length; i++) {
      var subClass = this.superClassOf[i];
      if ($.inArray(subClass.URI, checkedClasses) < 0) {
        subClass.getSubClasses(includeSuper, subClasses, checkedClasses);
      }
    }
  }
  return subClasses;
};

RDFE.OntologyClass.prototype.getSuperClasses = function(includeSub, superClasses, checkedClasses) {
  superClasses = superClasses || [];
  superClasses = _.union(superClasses, this.subClassOf);
  if (includeSub !== false) {
    checkedClasses = checkedClasses || [];
    checkedClasses.push(this.URI);
    for (var i = 0; i < this.subClassOf.length; i++) {
      var superClass = this.subClassOf[i];
      if ($.inArray(superClass.URI, checkedClasses) < 0) {
        superClass.getSuperClasses(includeSub, superClasses, checkedClasses);
      }
    }
  }
  return superClasses;
};

RDFE.OntologyClass.prototype.getUniqueRestrictions = function() {
  var uniqueRestrictions = [];
  if (this.restrictions) {
    for (var key in this.restrictions) {
      var property = this.restrictions[key];
      if (property.isUniqueId === true) {
        uniqueRestrictions.push(this.manager.ontologyPropertyByURI(key));
      }
    }
  }
  return uniqueRestrictions;
};

RDFE.OntologyClass.prototype.getIndividuals = function(includeSuper) {
  var individuals = this.individuals;
  if(includeSuper) {
    var subClasses = this.getSubClasses(true);
    for (var i = 0; i < subClasses.length; i++) {
      individuals = _.union(individuals, subClasses[i].individuals);
    }
  }
  return individuals;
};

/**
 * Find a Fresnel Lens for this class.
 *
 * Check this class and all super-classes for a fresnel lens and
 * returns it.
 */
RDFE.OntologyClass.prototype.getFresnelLens = function() {
  var fl = this.fresnelLens;
  if (!fl) {
    var superClasses = this.getSuperClasses(true);
    for (var i = 0; i < superClasses.length; i++) {
      fl = superClasses[i].fresnelLens;
      if (fl) {
        return fl;
      }
    }
  }
  return fl;
};

/*
 *
 * Ontology Property
 *
 */
RDFE.OntologyProperty = function(ontologyManager, URI) {
  // console.log('property =>', URI);

  this.URI = URI;
  this.curi = ontologyManager.uriNormalize(URI);
  this.name = RDFE.Utils.uri2name(URI);
  this.subPropertyOf = [];
  this.superPropertyOf = [];
  this.domain = [];
  this.range = [];

  this.manager = ontologyManager;
  this.manager.ontologyProperties[URI] = this;
};

RDFE.OntologyProperty.prototype.hasDomain = function(domain) {
  var self = this;
  if (self.domain) {
    for (var j = 0; j < self.domain.length; j++) {
      if (domain == self.domain[j]) {
        return true;
      }
    }
  }
  return false;
};

RDFE.OntologyProperty.prototype.getRange = function(subProperties) {
  // check if this property has a range itself
  var self = this;
  var range = self.range;
  if (!_.isEmpty(range)) {
    return range;
  }

  // check super-properties (with loop-protection)
  for (var i = 0; i < self.subPropertyOf.length; i++) {
    var subProperty = self.subPropertyOf[i];
    if ($.inArray(subProperty.URI, subProperties) < 0) {
      subProperties = subProperties || [];
      subProperties.push(subProperty.URI);
      range = subProperty.getRange(subProperties);
      if (!_.isEmpty(range)) {
        return range;
      }
    }
    else {
      console.log('CAUTION: Found sub-property loop in ', subProperties);
    }
  }

  return undefined;
};

RDFE.OntologyProperty.prototype.getSuperProperties = function(includeSub, superProperties, checkedProperties) {
  superProperties = superProperties || [];
  superProperties = _.union(superProperties, this.subPropertyOf);
  if (includeSub !== false) {
    checkedProperties = checkedProperties || [];
    checkedProperties.push(this.URI);
    for (var i = 0; i < this.subPropertyOf.length; i++) {
      var superClass = this.subPropertyOf[i];
      if ($.inArray(superClass.URI, checkedProperties) < 0) {
        superClass.getSuperProperties(includeSub, superProperties, checkedProperties);
      }
    }
  }
  return superProperties;
};

/*
 *
 * Ontology Individual
 *
 */
RDFE.OntologyIndividual = function(ontologyManager, URI, options) {
  // console.log('individual =>', URI);
  var self = this;

  this.URI = URI;
  this.curi = ontologyManager.uriNormalize(URI);
  this.name = RDFE.Utils.uri2name(URI);

  this.manager = ontologyManager;
  this.manager.individuals[URI] = this;
};

/*
 *
 * Fresnel Lens
 *
 */
RDFE.FresnelLens = function(ontologyManager, URI) {
  // console.log('fresnel lens =>', URI);
  this.URI = URI;

  this.manager = ontologyManager;
  this.showProperties = [];
  this.hideProperties = [];
};
