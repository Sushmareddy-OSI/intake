# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Screening Decision Validations' do
  let(:error_message) { 'Please enter at least one allegation to promote to referral.' }
  let(:perpetrator) { FactoryGirl.create(:participant, :perpetrator) }
  let(:victim) { FactoryGirl.create(:participant, :victim) }
  let(:screening_decision_detail) { nil }
  let(:additional_information) { nil }
  let(:screening) do
    FactoryGirl.create(
      :screening,
      additional_information: additional_information,
      participants: [perpetrator, victim],
      screening_decision: screening_decision,
      screening_decision_detail: screening_decision_detail
    )
  end

  before do
    allegation = FactoryGirl.create(
      :allegation,
      victim_id: victim.id,
      perpetrator_id: perpetrator.id,
      screening_id: screening.id
    )
    screening.allegations << allegation
  end

  context 'When page is opened in edit mode' do
    before do
      stub_and_visit_edit_screening(screening)
    end

    context 'Screening decision is set to nil on page load' do
      let(:screening_decision) { nil }

      scenario 'card displays errors until user adds a screening decision' do
        validate_message_as_user_interacts_with_card(
          invalid_screening: screening,
          card_name: 'decision',
          error_message: 'Please enter a decision',
          screening_updates: { screening_decision: 'screen_out' }
        ) do
          within '#decision-card.edit' do
            select 'Screen out', from: 'Screening Decision'
          end
        end
      end

      scenario 'Selecting promote to referral decision requires allegations' do
        within '#decision-card.edit' do
          expect(page).not_to have_content(error_message)
          click_button 'Cancel'
        end

        within '#decision-card.show' do
          expect(page).not_to have_content(error_message)
          click_link 'Edit'
        end

        stub_screening_put_request_with_anything_and_return(
          screening,
          with_updated_attributes: { screening_decision: 'promote_to_referral' }
        )

        within '#decision-card.edit' do
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
          click_button 'Save'
        end

        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end
      end

      scenario 'Clearing promote to referral decision removes error message' do
        within '#decision-card.edit' do
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
          select 'Screen out', from: 'Screening Decision'
          blur_field
          expect(page).not_to have_content(error_message)
        end
      end

      scenario 'Adding and removing allegations shows or hides error message' do
        within '#decision-card.edit' do
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
        end

        within '#allegations-card.edit' do
          fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'General neglect'
        end

        within '#decision-card.edit' do
          expect(page).not_to have_content(error_message)
        end

        within '#allegations-card.edit' do
          remove_react_select_option "allegations_#{victim.id}_#{perpetrator.id}", 'General neglect'
        end

        within '#decision-card.edit' do
          expect(page).to have_content(error_message)
        end
      end
    end

    context 'Screening decision is already set to promote to referral' do
      let(:screening_decision) { 'promote_to_referral' }

      scenario 'Error message doesn not display until user has interacted with the field' do
        within '#decision-card.edit' do
          expect(page).not_to have_content(error_message)
          select 'Promote to referral', from: 'Screening Decision'
          blur_field
          expect(page).to have_content(error_message)
        end
      end

      scenario 'card displays errors until user selects a response time' do
        validate_message_as_user_interacts_with_card(
          invalid_screening: screening,
          card_name: 'decision',
          error_message: 'Please enter a response time',
          screening_updates: { screening_decision_detail: '3_days' }
        ) do
          within '#decision-card.edit' do
            select '3 days', from: 'Response time'
          end
        end
      end
    end

    context 'when screening decision is "Screen out" and category is "Evaluate out"' do
      let(:error_message) { 'Please enter additional information' }

      scenario 'additional information is a required field' do
        within '#decision-card.edit' do
          expect(page.find('label', text: 'Additional information')).not_to match_css('.required')
          expect(page.find_field('additional_information')[:required]).to eq nil
          select 'Screen out', from: 'Screening Decision'
          expect(page.find('label', text: 'Additional information')).not_to match_css('.required')
          expect(page.find_field('additional_information')[:required]).to eq nil
          select 'Evaluate out', from: 'Category'
          expect(page.find_field('additional_information')[:required]).to eq 'true'
          expect(page.find('label', text: 'Additional information')).to match_css('.required')
        end
      end

      scenario 'Error message doesnt display until user blurs out additional information field' do
        within '#decision-card.edit' do
          expect(page).not_to have_content(error_message)
          select 'Screen out', from: 'Screening Decision'
          select 'Evaluate out', from: 'Category'
          fill_in 'Additional information', with: ''
          expect(page).not_to have_content(error_message)
          blur_field
          expect(page).to have_content(error_message)
        end
      end
    end
  end

  context 'When page is opened in show view' do
    before do
      stub_and_visit_show_screening(screening)
    end

    context 'Screening decision is set to nil on page load' do
      let(:screening_decision) { nil }

      scenario 'User does not see error messages on page load' do
        within '#decision-card.show' do
          expect(page).not_to have_content(error_message)
        end
      end
    end

    context 'Screening decision is already set to promote to referral' do
      let(:screening_decision) { 'promote_to_referral' }

      scenario 'User sees error messages on page load' do
        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end
      end

      scenario 'Adding and removing allegations shows or hides error message' do
        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end

        within '#allegations-card.show' do
          click_link 'Edit'
        end

        within '#allegations-card.edit' do
          fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'General neglect'
        end

        within '#decision-card.show' do
          expect(page).not_to have_content(error_message)
        end

        within '#allegations-card.edit' do
          remove_react_select_option "allegations_#{victim.id}_#{perpetrator.id}", 'General neglect'
        end

        within '#decision-card.show' do
          expect(page).to have_content(error_message)
        end
      end
    end

    context 'when screening decision is "Screen out" and category is "Evaluate out"' do
      let(:screening_decision) { 'screen_out' }
      let(:screening_decision_detail) { 'evaluate_out' }
      let(:error_message) { 'Please enter additional information' }

      context 'when additional information is not populated' do
        scenario 'additional information is marked as a required field' do
          within '#decision-card.show' do
            expect(page.find('label', text: 'Additional information')).to match_css('.required')
          end
        end

        scenario 'additional information has an error message' do
          within '#decision-card.show' do
            expect(page).to have_content(error_message)
          end
        end
      end
    end

    context 'when additional information is populated' do
      let(:additional_information) { 'evaluate out info' }
      let(:screening_decision) { 'screen_out' }
      let(:screening_decision_detail) { 'evaluate_out' }

      scenario 'additional information is marked as a required field' do
        within '#decision-card.show' do
          expect(page.find('label', text: 'Additional information')).to match_css('.required')
        end
      end

      scenario 'additional information has no error message' do
        within '#decision-card.show' do
          expect(page).not_to have_content(error_message)
        end
      end
    end
  end
end
