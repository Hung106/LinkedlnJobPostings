--posting--
CREATE INDEX idx_title ON posting(title);

--posting state--
CREATE INDEX idx_expiry ON posting_state(expiry); 
CREATE INDEX idx_remaining_time ON posting_state(remaining_time);
CREATE INDEX idx_apply_view_composite ON posting_state(apply_rate, views); --composite--

--company--
CREATE INDEX idx_company_name ON companies(company_name);

--company location--
CREATE INDEX idx_zip_code ON company_locations(zip_code);
CREATE INDEX idx_city_address_composite ON company_locations(city, address); --composite--

--salary--
CREATE INDEX idx_salary_composite ON salary(salary_type, value); --composite--