var app_doc = {
    data: {
      unitsModalisActive: false,
      uploadModalisActive: false,
      loadingModalisActive: false,


    },
    computed : {
      dimensions_used: function() {
          dimensions = []
          for (var dimension in this.doc.units) {
              if (this.doc.units.hasOwnProperty(dimension)) {
                  dimensions.push(dimension);
              }
          }
          return dimensions;
      },
      units_used : function(){
        var clone = JSON.parse(JSON.stringify(this.doc.units))
        return clone;
      }
    },
    watch: {
      'units_used': {
          handler: function(new_units, old_units) {
              try {
                 this.treeUnitConvert(this.doc, old_units, new_units);
              } catch (err) {
                  console.log("Error in watch handler for units_used");
              }
          },
          deep: true,
      }
    },
    methods : {
      calculate : function(){
          fn_success =function(){};
          this.doc['result'] ={};
          this.doc['errors'] =[];
          calculation_url = this.doc['api_url']
          this.process_resource("doc", calculation_url, fn_success);
      },


      getErrs: function(path_array) {
          try{
              var app = this;
              xval = this.retSilent(app['schema_errors']['input'], path_array);
              if (xval instanceof Array){
                   return xval
                 }
              else {return []}
           }
           catch (err) {
               return [];
           }
         },


/*
      getErrs: function(path_array) {
          try{

              val = this.response['schema_errors']['input'];
              total_length = path_array.length;
              for (i = 0; i < total_length; i++) {
                  key = path_array[i];
                  val = val[key];
              }
              return val;
          }
          catch (err) {
              return [];
          }
      },
*/
      getResult: function(path_array) {
          try{
             var app = this;
              xval = this.retSilent(app['doc']['result'], path_array);
             if (typeof xval ==='object'){
                if (xval.hasOwnProperty("_val") ){
                  return xval['_val']
                }
                else {return ""}
              }
              else{
                return xval;
              }
          }
          catch (err) {
              return "";
          }
      },

      gUL: function(dimension) {
          try {
              unitUsed = this.doc.units[dimension]
              unitLabel = getUnitLabel(dimension, unitUsed)
              return unitLabel
          } catch (err) {
              console.log("Error occured in getUnitLabel trying to fetch unitUsed '" + unitUsed + "'")
              return '';
          }
      },

      getUnits: function(dimension) {
          try {
              return getUnits(dimension)
          } catch (err) {
              console.log("Error occured in getUnits with dimension = '" + dimension + "'");
          }
      },

      treeUnitConvert : function(tree, fromUnits, toUnits){
          treeUnitConvert(tree, fromUnits, toUnits);
      }

    }
}
