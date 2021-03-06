# frozen_string_literal: true

require File.join(File.dirname(__FILE__), 'routes/inactive_release_one_constraint')
require File.join(File.dirname(__FILE__), 'routes/inactive_release_two_constraint')
require File.join(File.dirname(__FILE__), 'routes/inactive_release_one_and_two_constraint')
require File.join(File.dirname(__FILE__), 'routes/active_referral_submit_constraint')
require File.join(File.dirname(__FILE__), 'routes/active_investigations_constraint')

Rails.application.routes.draw do
  root 'home#index'
  get '/404', to: 'errors#not_found', via: :all
  get '/500', to: 'errors#server_error', via: :all
  get '/403', to: 'errors#forbidden', via: :all

  resources :screenings,
    only: %i[edit],
    to: 'home#index',
    constraints: Routes::InactiveReleaseOneConstraint do
  end

  resources :screenings,
    only: %i[show],
    to: 'home#index',
    constraints: Routes::InactiveReleaseOneAndTwoConstraint do
  end

  resources :investigations,
    only: [:show],
    to: 'home#index',
    constraints: Routes::ActiveInvestigationsConstraint do
    resources :contacts, only: %i[new show edit], to: 'home#index'
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get '/security/check_permission' => 'security#check_permission'
      get '/user_info' => 'user#user_info'

      resources :screenings,
        only: %i[index],
        constraints: Routes::InactiveReleaseOneAndTwoConstraint

      resources :screenings,
        only: %i[update],
        constraints: Routes::InactiveReleaseOneAndTwoConstraint

      resources :screenings,
        only: %i[show create],
        constraints: Routes::InactiveReleaseOneConstraint do
        member do
          get 'history_of_involvements'
          get 'relationships' => 'relationships#by_screening_id'
          post 'submit', constraints: Routes::ActiveReferralSubmitConstraint
        end
      end

      resources :participants, only: %i[create destroy]

      resources :participants,
        only: %i[update],
        constraints: Routes::InactiveReleaseTwoConstraint

      resource :people, only: [:search] do
        collection do
          get 'search'
        end
      end

      resources :investigations,
        only: %i[show],
        constraints: Routes::ActiveInvestigationsConstraint do
        resources :contacts, only: %i[create show update], module: :investigations
      end

      resources :system_codes,
        only: [:index]
      get 'cross_report_agency/:county_id', to: 'system_codes#cross_report_agency'
    end
  end

  scope host: Rails.configuration.intake[:dora_api_url] do
    post '/dora/screenings/screening/_search' => 'dev#null', as: :dora_screenings
    post '/dora/people/person/_search' => 'dev#null', as: :dora_people
    post '/dora/people-summary/person-summary/_search' => 'dev#null', as: :dora_people_light_index
  end

  resources :version, only: :index
  get '/logout' => 'home#logout'

  get '/pages/*id' => 'pages#show', as: :page, format: false
end
