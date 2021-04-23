define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var BasicQuestionView = ComponentView.extend({

    events: {
      'click .js-select-option': 'onOptionSelected',
      'click .js-submit-click': 'onSubmitted',
      'click .js-feedback-click': 'onFeedback'
    },

    _correctAnswer: -1,
    _selectedAnswer: -1,
    _isSubmitted: false,
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },


    onOptionSelected: function(event) {
      event.preventDefault();

      if(this._isSubmitted === false) {
        const optionIndex = this.$(event.currentTarget).data('index');

        this.model.get('_items').forEach((item, i) => {
          if (i === optionIndex) {
            this.$('.js-select-option').eq(i).addClass("is-selected");
            this._selectedAnswer = i;
          } else {
            this.$('.js-select-option').eq(i).removeClass("is-selected");
          }
        });
      }
    },

    onSubmitted: function() {
      this.model.get('_items').forEach((item, i) => {
        if(item._shouldBeSelected == true) {
          this._correctAnswer = i;
        }
        this.$('.js-select-option').eq(i).addClass("is-submitted");
      });

      if(this._selectedAnswer === this._correctAnswer) {
        this.setupCorrectFeedback();
      } else {
        this.setupIncorrectFeedback();
      }

      this._isSubmitted = true;

      this.setCompletionStatus();
      this.model.set('_isComplete', true);

      this.$('.js-submit-click').addClass("is-hidden");
      this.$('.js-feedback-click').removeClass("is-hidden");
    },

    onFeedback: function() {
      if(this._selectedAnswer === this._correctAnswer) {
        this.setupCorrectFeedback();
      } else {
        this.setupIncorrectFeedback();
      }
    },

    getFeedbackTitle() {
      return this.model.get('_feedback').title || this.model.get('displayTitle') || this.model.get('title') || '';
    },

    setupCorrectFeedback() {
      Adapt.trigger('notify:popup', {
        title: this.getFeedbackTitle(),
        body: this.model.get('_feedback').correct
      });
    },

    setupIncorrectFeedback() {
      Adapt.trigger('notify:popup', {
        title: this.getFeedbackTitle(),
        body: this.model.get('_feedback').incorrect
      });
    }


  },
  {
    template: 'basic-question'
  });

  return Adapt.register('basic-question', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: BasicQuestionView
  });
});
