$(".result").fadeOut(0);
$('#submit').on("click",submit)
$(".input").focus(function(){
    $(this).css("background-color","#86d789")
})
$(".input").hover(function(){
    $(this).css("border","solid 2px #4caf50")
})
$(".input").mouseleave(function(){
    $(this).css("border","solid 2px black")
})
$(".input").blur(function(){
    $(this).css("background-color","white");
});
function submit(){
    let result = validate()
    if(result){
        $(".input").val("")
        window.location = "index.html"
    }
}
function validate(){
 let result = true;
    $(".result").fadeIn(1000);
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let inputFileds = $(".input") 
    let results = $(".result")
    for(let i = 0;i < 5;i++){
        results[i].textContent = ""
    }
    for(let i = 0;i < 5;i++){
        if(inputFileds[i].value.trim() == ""  || (i == 4 && inputFileds[i-1].value != inputFileds[i].value) || (i == 2 && !inputFileds[i].value.match(emailRegex) )){
            results[i].textContent = i==4?"Password Not Match   ":"Not valid"
            $(results[i]).css("color","red")
            result = false
        }else{
            results[i].textContent = "Valid"
            $(results[i]).css("color","green")
        }
    }   
    $(".result").fadeOut(1000);
    return result;
}