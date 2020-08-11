initialize()

function initialize() {
    fetch('/jobs?filter=all')
        .then((response) => response.json())
        .then((data) => {
            var jobsToday = 0
            data.forEach((obj) => {
                console.log("New job")
                var newDiv = document.createElement('div')
                newDiv.className="job-item"

                var name = document.createElement('h3')
                name.innerHTML = `Name: ${obj.clientname}`
                var email = document.createElement('h3')
                email.innerHTML = `Email: ${obj.clientemail}`

                var startDate = document.createElement('h3')
                var strArray = obj.startdate.split("T")
                var lastDate = strArray[0][strArray[0].length - 1]
                var newDate = strArray[0].slice(0, -1) + (parseInt(lastDate) + 1)
                startDate.innerHTML = `Date: ${newDate}`

                var address = document.createElement('h3')
                address.innerHTML = `Address: ${obj.clientaddress}`

                newDiv.appendChild(name)
                newDiv.appendChild(email)
                newDiv.appendChild(startDate)
                newDiv.appendChild(address)

                document
                    .getElementById('all-jobs-container')
                    .appendChild(newDiv)

                var today = new Date()
                var month = today.getMonth() + 1
                if (month <= 9) {
                    month = "0" + month
                }
                var date = today.getFullYear() + '-' + month + '-' + (today.getDate())

                if (newDate == date) {
                    console.log("Job found for today.")
                    jobsToday += 1
                    var todayDiv = newDiv.cloneNode(true)
                    document.getElementById('today-jobs-container').appendChild(todayDiv)
                } else {
                    console.log("Job NOT for today.")
                }
                console.log("")
            })
            setTodayAmount(jobsToday)
        })
}

function setTodayAmount (amount) {
    document.getElementById("job-amount").innerHTML = `${amount} jobs`
}

