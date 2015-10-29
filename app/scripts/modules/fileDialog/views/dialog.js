/* global define */
define([
    'underscore',
    'marionette',
    'backbone.radio',
    'behaviors/modalForm',
    'dropzone',
    'text!modules/fileDialog/templates/dialog.html'
], function(_, Marionette, Radio, ModalForm, Dropzone, Tmpl) {
    'use strict';

    /**
     * File dialog view.
     */
    var View = Marionette.ItemView.extend({
        template  : _.template(Tmpl),
        className : 'modal fade',

        behaviors: {
            ModalForm: {
                behaviorClass : ModalForm,
                uiFocus       : 'url'
            }
        },

        ui: {
            url    : '[name=url]',
            okBtn  : '#ok-btn',
            attach : '#btn-attach'
        },

        events: {
            'keyup @ui.url' : 'toggleAttachBtn',
            'click .attach-file': 'attachFile'
        },

        initialize: function() {
            this.files = [];
            this.listenTo(this, 'shown.modal', this.onShown);
        },

        attachFile: function(e) {
            e.preventDefault();
            this.trigger('save', true);
        },

        toggleAttachBtn: _.debounce(function() {
            this.ui.okBtn.toggleClass('hidden', this.ui.url.val().trim() !== '');
            this.ui.attach.toggleClass('hidden', this.ui.url.val().trim() === '');
        }, 250),

        onShown: function() {
            new Dropzone('.dropzone', {
                url             : '/#notes',
                clickable       : true,
                accept          : _.bind(this.getImage, this),
                thumbnailWidth  : 100,
                thumbnailHeight : 100
            });
        },

        /**
         * Save file data to a variable.
         */
        getImage: function(file) {
            var reader = new FileReader();

            this.ui.url.val('').trigger('keyup');

            reader.onload = _.bind(function(evt) {
                this.files.push({
                    name : file.name,
                    src  : evt.target.result,
                    type : file.type
                });
            }, this);

            reader.readAsDataURL(file);
        }

    });

    return View;
});