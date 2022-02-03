function openCsv(e) {
    var file = e.target.files[0]
    var reader = new FileReader()

    reader.onload = function (e) {
        var employees = e.target.result.slice(e.target.result.indexOf("\n") + 1).split("\n");

        let res = getOutput(employees)

        document.getElementById('output').innerHTML = res
    }

    reader.readAsText(file)
}

function errorHandling(emp1,  emp2) {
    if (emp1.length !== 4 || emp2.length !== 4) {
        return 'Invalid length data'
    } else if (
        new Date(emp1[2]) > new Date(emp1[3]) ||
        new Date(emp2[2]) > new Date(emp2[3])
    ) {
        return 'Invalid date data'
    }
}

function getOutput(employees) {
    let errors
    let workedTogether = []

    employees.forEach((emp1) => {
        emp1 = emp1.split(',  ')

        employees.forEach((emp2) => {
            emp2 = emp2.split(',  ')

            if (emp1[0] !== emp2[0] && emp1[1] === emp2[1]) {
                errors = errorHandling(emp1,  emp2)

                let emp1Id = emp1[0]
                let emp2Id = emp2[0]
                let project = emp1[1]

                let startEmp1 = new Date(emp1[2])
                let startEmp2 = new Date(emp2[2])

                let endEmp1 =
                    emp1[3] === 'NULL' ? new Date() : new Date(emp1[3])
                let endEmp2 =
                    emp2[3] === 'NULL' ? new Date() : new Date(emp2[3])

                let overlap = startEmp1 <= endEmp2 && startEmp2 <= endEmp1

                if (overlap) {
                    let start = Math.max(startEmp1,  startEmp2)
                    let end = Math.min(endEmp1,  endEmp2)

                    let period = Math.floor(
                        (end - start) / (1000 * 60 * 60 * 24)
                    )

                    workedTogether.push([emp1Id,  emp2Id,  project,  period])
                }
            }
        })
    })

    console.log(workedTogether)
    let finalOutput = workedTogether.sort((a,  b) => a[3] - b[3]).pop()

    return errors
        ? errors
        : `Employee ${finalOutput[0]} and employee ${finalOutput[1]} have worked together on project ${finalOutput[2]} for ${finalOutput[3]} days!`
}
