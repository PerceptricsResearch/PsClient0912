(function (prweb, $) {
    /**
    * Datastore is responsible for persisting and providing data from 
    * the Data Manager.
    */
    prweb.dataStore = {
        /**
        * _data stores the data used by datastore's get and set methods
        * @private
        */
        _data: {},

        /**
        * Gets data from the datastore
        *
        * @param {string} token  An identifier for retrieving associated data
        */
        get: function (token) {
            return this._data[token];
        },

        /**
        * Persists data in the datastore
        *
        * @param {string} token    An identifier for the stored data
        * @param {mixed} payload   A blob of data
        */
        set: function (token, payload) {
            // Store the data
            this._data[token] = payload;
        },

        /**
        * Removes an item from the data store
        *
        * @param {string} token    An identifier for the stored data
        */
        clear: function (token) {
            try {
                this._data[token] = null;
                delete this._data[token];
            }
            catch (ex) {
                alert("prweb.dataStore.clear reports " + ex.Message);
            }
        },

        /**
        * Clears all data from the data store
        */
        clearAll: function () {
            this._data = {};
        }
    };

    /**
    * Data Manager is responsible for fetching data, storing it, 
    * and using callbacks to let callers know when that data is ready.
    */
    prweb.dataManager = {
        dataDefaults: {
            dataType: 'json',
            type: 'POST'
        },

        /**
        * When required, the data request URL will be modified to account for the 
        * webiste being deployed to a virtual directory instead of the website root. 
        *
        * Makes an ajax call to the specified endpoint to retrieve data.If sucessful 
        * stores the data in the data cache and calls the success callback.  
        *
        * This method mimics the options of $.ajax where appropriate.
        *
        * @param {object} options : Options object that maps to the ajax options object.
        *   this object must include the following fields:
        *       url : the url for the call
        *       success: a callback called on successful completion of the operation.
        */
        sendRequest: function (options) {
            // getRelativeEndpointUrl ensures the URL is relative to the website root.
            var datadflts = prweb.dataManager.dataDefaults,
                normalizedUrl = prweb.getRelativeEndpointUrl(options.url),
                cachedData = prweb.dataStore.get(normalizedUrl),
                callerOptions = $.extend({ cache: true }, datadflts, options, { url: normalizedUrl });

            if (callerOptions.cache && cachedData) {
                try {
                    options.success(cachedData);
                }
                catch (e) { alert("prweb.dataManager.sendRequest from cache reports error..."); }
                finally {
                    cachedData = null;
                    options.success = null;
                    delete options.success;
                    options.error = null;
                    delete options.error;
                    options = null;
                    datadflts = null;
                    normalizedUrl = null;
                    callerOptions.success = null;
                    delete callerOptions.success;
                    callerOptions.error = null;
                    delete callerOptions.error;
                    callerOptions = null;
                }
            }
            else {
                if (prweb.pubsub) {
                    prweb.pubsub.publish(prweb.events.status, {
                        type: 'saving',
                        message: 'Cloud access...',
                        duration: 2000
                    });
                }
                callerOptions.success = function (data) {
                    if (callerOptions.cache) {
                        prweb.dataStore.set(normalizedUrl, data);
                    }
                    try {
                        options.success(data);
                    }
                    catch (e) { alert("prweb.dataManager.sendrequest non-cached reports error..."); }
                    finally {
                        options.success = null;
                        delete options.success;
                        options = null;
                        //                        cachedData = null;
                        datadflts = null;
                        normalizedUrl = null;
                        data = null;
                        callerOptions.success = null;
                        delete callerOptions.success;
                        callerOptions.error = null;
                        delete callerOptions.error;
                        callerOptions = null;
                    }
                };

                $.ajax(callerOptions);
            }
            return true;
        },


        cachedOnlyRequest: function (options) {
            // getRelativeEndpointUrl ensures the URL is relative to the website root.
            var that = prweb.dataManager,
                normalizedUrl = prweb.getRelativeEndpointUrl(options.url),
                cachedData = prweb.dataStore.get(normalizedUrl);

            if (cachedData) {
                options.success(cachedData);
                return;
            }
            else {
                options.error('not available in cache');
                return;
            }

        },
        /**
        * resetData will clear the specified data from the cache so subsequent calls
        * to get the data will result in returning to the server for the data
        */
        resetData: function (endpoint) {
            prweb.dataStore.clear(prweb.getRelativeEndpointUrl(endpoint));
        }
    };

} (this.prweb = this.prweb || {}, jQuery));