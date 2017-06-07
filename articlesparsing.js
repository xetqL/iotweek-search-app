'use strict';
module.exports = {
    classifyRegistration : function (participantJsonData){
        const full_reg    = 'Full Registration'
        const red_reg     = 'Reduced Registration'
        const daily       = 'Daily Pass'
        const special     = 'Special Registration requiring a Code (Registration fees will be calculated after entering the code in page 3)'
        const gala_dinner = 'Additional Gala Dinner'
        const d_friday    = 'Friday 9 June'
        const d_wednesday = 'Wednesday 7 June'
        const d_thursday  = 'Thursday 8 June'
        const d_tuesday   = 'Tuesday 6 June'
        const with_dinner = "WithDinner"
        const no_dinner   = "NoDinner"
        const student     = "Stu"
        const exhibitor   = "Exh"
        function checkCode(participantJsonData){
            let code = participantJsonData["Code Promo"]
            if(code.toLowerCase().includes(with_dinner.toLowerCase())) return [10]
            if(code.toLowerCase().includes(no_dinner.toLowerCase()))   return [20]
            if(code.toLowerCase().includes(exhibitor.toLowerCase()))   return [40]
            if(code.toLowerCase().includes(student.toLowerCase()))     return [10]
            return []
        }
        
        function checkCategory(participantJsonData, checkOn){
            //console.log(participantJsonData,checkOn)
            let articles = participantJsonData[checkOn].replace('  ', ' ')
            let participantCategories = []
            if (articles.toLowerCase().includes(full_reg.toLowerCase())) return [10] 
            if (articles.toLowerCase().includes(red_reg.toLowerCase()))  return [20]
            if (articles.toLowerCase().includes(daily.toLowerCase())) { //check for day
                if (articles.toLowerCase().includes(d_tuesday.toLowerCase()))   participantCategories.push(30)
                if (articles.toLowerCase().includes(d_wednesday.toLowerCase())) participantCategories.push(31)
                if (articles.toLowerCase().includes(d_thursday.toLowerCase()))  participantCategories.push(32)
                if (articles.toLowerCase().includes(d_friday.toLowerCase()))    participantCategories.push(33)
            }
            return participantCategories
        }

        let participantCategories = []  
        participantCategories = participantCategories.concat(checkCategory(participantJsonData, "Articles"))
        participantCategories = participantCategories.concat(checkCode(participantJsonData))
        participantCategories = participantCategories.concat(checkCategory(participantJsonData, "Détail"))
        participantCategories = Array.from(new Set(participantCategories))
        participantCategories = participantCategories.length == 0 ? [0] : participantCategories
        return participantCategories
    },
    categoryToCardpressoReadable : function (category){
        if(category == 40) return 'exhibitor'
        if(category == 30) return 'daily-tuesday'
        if(category == 31) return 'daily-wednesday'
        if(category == 32) return 'daily-thursday'
        if(category == 33) return 'daily-friday'
        if(category == 20) return 'reduced-registration'
        if(category == 10) return 'full-registration' 
        if(category == 0)  return 'unknown-registration'
    }
}


