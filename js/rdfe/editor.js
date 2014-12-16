if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}

RDFE.Editor = function(params) {
  var self = this;

  // empty default doc
  this.doc = new RDFE.Document();
};

// draw_graph_contents() { }
// insert() { }
// delete() { }
// update() { delete(); insert() ; draw_graph_contents() }

// useful functions
RDFE.Editor.escapeHTML = function(str) {
    return (str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') );
};

// rdf_store bits
RDFE.Editor.io_strip_URL_quoting = function(str) {
    return(str.replace(RegExp('^<(.*)>$'), '$1'));
};

RDFE.Editor.io_strip_litstr_quoting = function(str) {
    return(str.replace(RegExp('^"(.*)"$'), '$1'));
};

/**
 * Parse a string into a node object.
 */
RDFE.Editor.prototype.parseNTNode = function(s) {
    if(s[0] == '<')
        return this.doc.store.rdf.createNamedNode(RDFE.Editor.io_strip_URL_quoting(s));
    else if(s.startsWith('_:'))
        return this.doc.store.rdf.createNamedNode(s); // FIXME: blank nodes are so much trouble. We need to find a way to handle them properly
    else {
        var l = this.doc.store.parseLiteral(s);
        return this.doc.store.rdf.createLiteral(l.value, l.lang, l.type);
    }
};

RDFE.Editor.prototype.makeTriple = function(s, p, o) {
    ss=this.doc.store.rdf.createNamedNode(RDFE.Editor.io_strip_URL_quoting(s));
    pp=this.doc.store.rdf.createNamedNode(RDFE.Editor.io_strip_URL_quoting(p));
    // let's be dumb about this for now
    o = RDFE.Editor.io_strip_URL_quoting (o);
    if(o.startsWith("http") || o.startsWith("urn")) {
        oo=this.doc.store.rdf.createNamedNode(o);
    }
    else {
        var l = this.doc.store.parseLiteral(o);
        oo = this.doc.store.rdf.createLiteral(l.value, l.lang, l.type);
    }
    return(this.doc.store.rdf.createTriple(ss, pp, oo));
};


RDFE.Editor.prototype.getOldTriple = function(el) {
    var s=unescape(el.attr("data-statement-s-old"));
    var p=unescape(el.attr("data-statement-p-old"));
    var o=unescape(el.attr("data-statement-o-old"));
    return this.doc.store.rdf.createTriple(this.parseNTNode(s), this.parseNTNode(p), this.parseNTNode(o));
};

RDFE.Editor.prototype.getNewTriple = function(el) {
    var s=el.find("td[data-title='Subject'] a").text();
    var p=el.find("td[data-title='Predicate'] a").text();
    var o=el.find("td[data-title='Object'] a").text();
    return(this.makeTriple(s,p,o));
};

RDFE.Editor.prototype.saveTripleToElem = function(tripleTr, triple) {
    tripleTr.attr ('data-statement-s-old', escape(triple.subject.toNT()));
    tripleTr.attr ('data-statement-p-old', escape(triple.predicate.toNT()));
    tripleTr.attr ('data-statement-o-old', escape(triple.object.toNT()));
};

RDFE.Editor.prototype.createTripleRow = function(t, container) {
    var s=t.subject;
    var p=t.predicate;
    var o=t.object;
    container.append(' \
        <tr class="triple" \
        data-statement-s-old="' + escape(s.toNT()) + '" \
        data-statement-p-old="' + escape(p.toNT()) + '" \
        data-statement-o-old="' + escape(o.toNT()) + '"> \
        <td data-title="Subject"><a href="#" data-type="text" class="triple editable editable-click s">' + RDFE.Editor.escapeHTML(s.toString()) + '</a></td> \
        <td data-title="Predicate"><a href="#" data-type="text" class="triple editable editable-click p">' + RDFE.Editor.escapeHTML(p.toString())+ '</a></td> \
        <td data-title="Object"><a href="#" data-type="text" class="triple editable editable-click o">' + RDFE.Editor.escapeHTML(o.toString()) + '</a></td> \
        <td><a href="#" class="btn btn-danger btn-xs triple-action triple-action-delete">Delete<br></a></td> \
        </tr>\n');
    return container.find('tr.triple').last();
};

RDFE.Editor.prototype.createTripleActions = function(tripleRow, graphUri) {
    var self = this;

    tripleRow.find('.editable').editable({ mode: "inline" }).on('save', function(e, params) {
        var $this = $(this);
        var $tripleTr = $this.closest('tr');

        var updated_field = $this.hasClass("o") ? 'o' : $this.hasClass("s") ? 's' : $this.hasClass("p") ? 'p' : '';
        var s = updated_field == 's' ? params.newValue : $tripleTr.find('a.s').text();
        var p = updated_field == 'p' ? params.newValue : $tripleTr.find('a.p').text();
        var o = updated_field == 'o' ? params.newValue : $tripleTr.find('a.o').text();

        self.doc.store.delete(self.doc.store.rdf.createGraph([self.getOldTriple($tripleTr)]), graphUri, function(success) {
            if(success) {
                console.log("Successfully deleted old triple")

                var newTriple = self.makeTriple(s, p, o);

                self.doc.store.insert(self.doc.store.rdf.createGraph([newTriple]), graphUri, function(success){
                    if(success) {
                        // we simply update the old triple values in the tr tag
                        self.saveTripleToElem($tripleTr, newTriple);
                    }
                    else {
                        console.log('Failed to add new triple to store.');
                        // FIXME: Error handling!!!
                    }
                });
            }
            else {
              console.log('Failed to add delete old triple from store.');
                // FIXME: Error handling!!!
            }
        });
    });

    tripleRow.find('.triple-action-delete').on("click", function(e) {
        var $this = $(this);
        var $tripleTr = $this.closest('tr');
        self.doc.store.delete(self.doc.store.rdf.createGraph([self.getOldTriple($tripleTr)]), graphUri, function(success){
            if(success) {
                $tripleTr.remove();
            }
            else {
                // FIXME: Error handling!!!
            }
        });
    });
};

RDFE.Editor.prototype.createEditorUi = function(doc, container) {
    var self = this;
    this.doc = doc;

    doc.store.execute("select ?s ?p ?o where { graph <" + self.doc.graph + "> { ?s ?p ?o } } order by ?s ?p", function(success, r) {
        if(success) {
            container.empty();
            for(var i = 0; i < r.length; i++) {
                self.createTripleActions(
                  self.createTripleRow(
                    self.doc.store.rdf.createTriple(
                      self.doc.store.termToNode(r[i].s),
                      self.doc.store.termToNode(r[i].p),
                      self.doc.store.termToNode(r[i].o)),
                    container),
                  doc.graph);
            }
        }
        else {
            // FIXME: error handling.
          console.log('Failed to query triples in doc.');
        }
    });
};

RDFE.Editor.prototype.createNewStatementEditor = function(container) {
  var self = this;

  if(!this.doc)
    return false;

  container.prepend(' \
      <tr class="triple triple-new"> \
      <td data-title="Subject"><a href="#" data-type="text" class="triple editable editable-click s">' + '' + '</a></td> \
      <td data-title="Predicate"><a href="#" data-type="text" class="triple editable editable-click p">' + '' + '</a></td> \
      <td data-title="Object"><a href="#" data-type="text" class="triple editable editable-click o">' + '' + '</a></td> \
      <td><a href="#" class="btn btn-primary btn-xs triple-action triple-action-new-cancel">Cancel<br></a> \
        <a href="#" class="btn btn-default btn-xs triple-action triple-action-new-save">Save<br></a></td> \
      </tr>\n');
  var $newTripleTr = container.find('tr.triple-new');

  $newTripleTr.find('.editable').editable({ mode: "inline" });

  $newTripleTr.find('a.triple-action-new-cancel').click(function(e) {
      $newTripleTr.remove();
  });

  $newTripleTr.find('a.triple-action-new-save').click(function(e) {
      var t = self.getNewTriple($newTripleTr);
      self.doc.store.insert(self.doc.store.rdf.createGraph([t]), self.doc.graph, function(success){
          if(success) {
              $newTripleTr.remove();
              self.createTripleActions(self.createTripleRow(t, container), self.doc.graph);
          }
          else {
              console.log('Failed to add new triple to store.');
              // FIXME: Error handling!!!
          }
      });
  });
};