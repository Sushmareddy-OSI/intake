# frozen_string_literal: true

module ContactHelpers
  def stub_system_codes
    contact_statuses = [
      { code: 'A', value: 'Attempted', category: 'contact_status', sub_category: nil },
      { code: '1', value: 'Investigate Referral', category: 'contact_purpose', sub_category: nil },
      { code: 'ABC', value: 'In Person', category: 'communication_method', sub_category: nil }
    ]
    stub_request(:get, ferb_api_url(ExternalRoutes.ferb_api_lov)).and_return(
      json_body(contact_statuses, status: 200)
    )
  end
end

RSpec.configure do |config|
  config.include ContactHelpers, type: :feature
end
