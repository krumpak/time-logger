/*	
*	Time Logger
*	Author: Gorazd Krumpak
*	Version: 1.0
*	paste script before ent tag body:	<script src='http://timelogger.primaprodukcija.si/time-logger.js></script>
*	use minified version:	<script src='http://timelogger.primaprodukcija.si/tl.min.js></script>
*	Click right-bottom button 'Open Log' to access stored data.
*/

function WriteLocalStorage(Data){
	localStorage.setItem("TimeLog", JSON.stringify(Data));
}
function ReadLocalStorage(){
	var Data=localStorage.getItem("TimeLog");
	return JSON.parse(Data);
}
function LeadingZero(Number){
	if( Number <= 9 ){ return "0"+Number; } 
	else { return Number; }
}
function CurrentTime(){
	var now=new Date;
	var time=LeadingZero(now.getDate())+'. '+LeadingZero(now.getMonth()+1)+'. '+now.getFullYear()+' '+LeadingZero(now.getHours())+':'+LeadingZero(now.getMinutes())+":00"; //+':'+LeadingZero(now.getSeconds())
	return time.toString();
}
function DuplicateEntry(Item){
	var Storage=ReadLocalStorage();

	var Duplicate="add";
		
	for(var i=0; i < Storage.length; i++){
		if(Storage[i]==Item){
			Duplicate="skip";
		}
	}
	return Duplicate;
}
function AddLog(){
	var now=CurrentTime();
	var Storage=ReadLocalStorage();

	if(DuplicateEntry(now)=="add"){
		Storage.push(now);
		WriteLocalStorage(Storage);
	} else {
		//console.log("Duplicate Entry");
	}
}
function DeleteEntry(ID){
	var Storage=ReadLocalStorage();
	
	var Removed = Storage.splice(ID, 1);

	WriteLocalStorage(Storage);
	
	var CurrentURL=window.location.href;
	Reload(CurrentURL);
}
function EchoTime(){
	var body=document.getElementsByTagName('body')[0];
	var CurrentURL=window.location.href;
	var RedirectURL=CurrentURL.replace(/\?openlog/gi, "");
	var Storage=ReadLocalStorage();

	var String ='<style>';
	String +=' .sticky {height:100%; position:fixed; width:120px; left:0; top:0; z-index:100; border-top:0;}';
	String +=' button, span { color:black; font-size:15px; background-color:white; font-family:arial,sans-serif; position:absolute; width:90px; margin-left:20px; }';
	String +=' #table-data { margin-left:120px; width: 300px; }';
	String +=' </style>';

	String +='<div class="sticky">';
	String +='<span class="btn btn-default" role="button" style="bottom:20px;" onclick="window.scrollTo(0, 0);;">To Top</span>';
	String +='<button class="btn btn-default" type="submit" style="top:120px;" onClick=DopyData();>Copy data</button>';
	String +='<button class="btn btn-default" type="submit" style="top:120px;" onClick=Reload('+"'"+RedirectURL+"'"+');>Close</button>';
	String +='<button class="btn btn-default" type="submit" style="top:220px;" onClick='+"'ClearTime();'"+'>Clear All</button>';
	String +='<span class="btn btn-default" role="button" style="top:20px;" onclick="window.scrollTo(0, document.body.scrollHeight);">To Bottom</span>';
	String +='</div>';

	var TableData ='<div id="table-data"><table class="table table-bordered table-condensed table-striped" border="1">';
		
	if( Storage != null ){
		for(var i=0; i < Storage.length; i++){
			TableData += "<tr>";
			TableData += "<td style='padding: 0 2px;'>"+(i+1)+".</td>";
			TableData += "<td title='Select All => copy&paste to Excel!' style='padding: 0 2px;'>"+Storage[i]+"</td>";
			TableData += "<td style='padding: 0 2px;' title='Delete current entry!'> <div style='padding: 0 10px;' onclick='DeleteEntry("+i+");'>&#10006;</div> </td>";
			TableData += "</tr>";
		}
	}
	TableData+='</table></div>';

	body.innerHTML=String+TableData;
}
function Reload(URL){
    t1=window.setTimeout(function(){ window.location.href=URL; },500);
}
function ClearTime(){
	localStorage.removeItem("TimeLog");
	console.log('Clear DATA');

	document.getElementById("table-data").innerHTML='<div class="alert alert-danger" role="alert">Close window/tab to avoid further logging!</div>';
}
function TimeLogger(){
	var CurrentURL=window.location.href;
	if(CurrentURL!=''){
		//console.log(CurrentURL);

		if(CurrentURL.search(/openlog/gi)>=6){
			EchoTime();
		} else {
			//console.log('No DATA to display');
			if (localStorage.getItem("TimeLog") === null) {
				var Data=[];
				WriteLocalStorage(Data);
			}
			AddLog();

			document.write('<div style="position:fixed;bottom: 0;right:0;"><a href="'+CurrentURL+'?openlog" target="_self" style="color:white;background-color:grey;padding:3px 6px;z-index:100;text-decoration:none;border-top-left-radius:3px;">Open Log</a>');

			document.body.addEventListener("click", function(){ AddLog() }, false);
			document.body.addEventListener("keypress", function(){ AddLog() }, false);

			var body=document.getElementsByTagName('body')[0];
			body.onfocus=function(){ AddLog(); }
			body.onscroll=function(){ AddLog(); }
		}
	} else {
		console.log('No URL');
	}
}

TimeLogger();