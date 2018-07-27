import time
import httplib
from datetime import datetime

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

import config

form_url = 'https://www.dmv.ca.gov/wasapp/foa/clear.do?goTo=driveTest&localeName=en'
min_date = datetime.strptime(config.MIN_DATE,'%B %d, %Y').date()
max_date = datetime.strptime(config.MAX_DATE,'%B %d, %Y').date()

counter = 0

driver = webdriver.Chrome()

def look_for_appointments():
    global max_date 
    global counter 

    driver.get(form_url)

    WebDriverWait(driver, 120).until(EC.presence_of_element_located((By.ID, "app_content")))

    # Enter form data
    offices = config.OFFICE_IDS
    i_office = counter % len(offices)
    print("Request #" + str(counter) + " - DMV " + config.OFFICE_LOGS[i_office] + ":")
    counter = counter + 1
    
    office_id = Select(driver.find_element_by_name('officeId'))
    office_id.select_by_value(offices[i_office])
    driver.find_element_by_id("DT").click()
    driver.find_element_by_id('first_name').send_keys(config.FIRSTNAME)
    driver.find_element_by_id('last_name').send_keys(config.LASTNAME)
    driver.find_element_by_id('dl_number').send_keys(config.DLNUMBER)
    driver.find_element_by_name('birthMonth').send_keys(config.BIRTHMONTH)
    driver.find_element_by_name('birthDay').send_keys(config.BIRTHDAY)
    driver.find_element_by_name('birthYear').send_keys(config.BIRTHYEAR)
    driver.find_element_by_name('telArea').send_keys(config.TELAREA)
    driver.find_element_by_name('telPrefix').send_keys(config.TELPREFIX)
    driver.find_element_by_name('telSuffix').send_keys(config.TELSUFFIX)

    driver.find_element_by_name('ApptForm').submit()

    WebDriverWait(driver, 120).until(EC.presence_of_element_located((By.ID, "ApptForm")))

    result_html = driver.page_source
    soup = BeautifulSoup(result_html, "html5lib")
    results = soup.findAll("td", {"data-title" : "Appointment"})

    # Get first Appointment result, which is the one for the selected location
    appt_text = results[0].find('strong').get_text().strip()
    if "Sorry, no appointment is available for the date" in appt_text: 
        print("No appointment available")
        return

    # Reformat date. Format returned is "Monday, August 21, 2017 at 10:00 AM'
    appt_date_time = datetime.strptime(appt_text,'%A, %B %d, %Y at %I:%M %p')
    # Remove the time, compare just the dates
    appt_date = appt_date_time.date()

    # Check if it matches the configured date.
    # Only true if the dates are the exact same, e.g. 2017-08-21 == 2017-08-21
    if min_date < appt_date < max_date:
        print("Congratulations! You've found a date on your target date. Scheduling the appointment...")
        driver.find_element_by_id('ApptForm').submit()
        print("Confirming the appointment...")
        WebDriverWait(driver, 120).until(EC.presence_of_element_located((By.ID, "ApptForm")))
        driver.find_element_by_id('ApptForm').submit()
        print("Confirmed appointment for ",appt_date_time)
        max_date = appt_date
    else:
        print(appt_date_time)

while True:
    look_for_appointments()
    time.sleep(config.CHECKING_INTERVAL)
