/*	
*	Time Logger
*	Author: Gorazd Krumpak
*	Version: 2.0
*	Copyright (C) 2015  Gorazd Krumpak
*
*	This program is free software: you can redistribute it and/or modify
*	it under the terms of the GNU General Public License as published by
*	the Free Software Foundation, either version 3 of the License.
*
*	This program is distributed in the hope that it will be useful,
*	but WITHOUT ANY WARRANTY; without even the implied warranty of
*	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*	GNU General Public License for more details.
*
*	You should have received a copy of the GNU General Public License
*	along with this program.  If not, see <http://www.gnu.org/licenses/>
*
*
*
*	Logging Time of activities, stored in LocalStorage
*
*	paste compressed, production version script before end tag body:
*	<!-- REMOVE BEFORE PUBLICATION -->
*	<script src="http://primaprodukcija.si/repo/time-logger/time-logger.js"></script>
*	use uncompressed, development version:
*	<!-- REMOVE BEFORE PUBLICATION -->
*	<script src="http://primaprodukcija.si/repo/time-logger/tl.min.js"></script>
*	Remove before publish!
*	Click right-bottom button 'Open Log' to access stored data.
*	Logging on tag BODY load, click, keypress, focus, scroll
*	Log interval is set to 1 minute
*	You can add comments to log.
*	Keyboard shortcuts:
*	- ENTER: save entry
*	- TAB: save entry & go to next
*	- SHIFT + TAB: save entry & go to previous
*	- ESC: cancel changes
*	Copy raw data.
*/

var CommentString = " ## ";

function _$(ID){
	return document.getElementById(ID);
}
function GetURL(){
	var CurrentURL=window.location.href;
	var position = CurrentURL.indexOf("#");
	if( position > 1 ){
		CleanCurrentURL = CurrentURL.substring(0, position);
	} else {
		CleanCurrentURL = CurrentURL;
	}
	return CurrentURL;
}
function WriteLocalStorage(Data){
	localStorage.setItem("TimeLog", JSON.stringify(Data));
}
function ReadLocalStorage(){
	var Data=localStorage.getItem("TimeLog");
	//console.log(Data.length);
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
	
	var CurrentURL=GetURL();
	Reload(CurrentURL);
}
function EchoTime(){
	var body=document.body;
	var CurrentURL=GetURL();
	var RedirectURL=CurrentURL.replace(/\?openlog/gi, "");
	var Storage=ReadLocalStorage();

	var String ='<style>';
	String +=' .sticky {height:100%; position:fixed; width:120px; left:0; top:0; z-index:100; border-top:0;}';
	String +=' button, span { color:black; font-size:15px; background-color:white; font-family:arial,sans-serif; position:absolute; width:90px; margin-left:20px; }';
	String +=' #table-data { margin-left:120px; width: 620px; }';
	String +=' input { width:320px;height:20px;font-size: 12px;margin:0;padding:0;border:0;background-color:black;color:yellow;cursor:text; }';
	String +=' span, .glyphicon, div, b, button { cursor:pointer; }';
	String +=' </style>';

	String +='<div class="sticky">';
	String +='<span class="btn btn-default" role="button" style="bottom:20px;" onclick="window.scrollTo(0, 0);">To Top</span>';
	String +='<button class="btn btn-default" type="submit" style="top:120px;" onClick=Reload('+"'"+RedirectURL+"'"+');>Close</button>';
	String +='<button class="btn btn-default" type="submit" style="top:170px;" onClick=CopyRawData();>Raw data</button>';
	String +='<button class="btn btn-default" type="submit" style="top:270px;" onClick='+"'ClearTime();'"+'>Clear All</button>';
	String +='<span class="btn btn-default" role="button" style="top:20px;" onclick="window.scrollTo(0, document.body.scrollHeight);">To Bottom</span>';
	String +='</div>';

	var TableData ='<div id="table-data"><table class="table table-bordered table-condensed table-striped" border="1">';
		
	if( Storage != null ){
		for(var i=0; i < Storage.length; i++){
			var Item = Storage[i];
			var ItemComment =  Item.indexOf(CommentString);
			if( ItemComment > 0 ){
				var Separation = Item.split(CommentString);
				var TimeData = Separation[0];
				var CommentData = "<td title='Edit Comment' style='padding: 0 2px;'><div id='static"+i+"' onclick='AddComment("+i+");'>"+Separation[1]+" +</div><div id='change"+i+"' style='display:none;white-space:nowrap;'><input class='inline' title='Add Comment' type='text' id='input"+i+"' value='"+Separation[1]+"' maxlength='50' onkeypress='EnterComment(event, "+i+");'>&nbsp;<b class='inline' title='Save' onclick='SaveComment("+i+");'>&nbsp;&radic;&nbsp;</b>&nbsp;<b class='inline' title='Cancel' onclick='CancelComment("+i+");'>&nbsp;&#215;&nbsp;</b></div></td>";
			} else {
				var TimeData = Item;
				var CommentData = "<td title='Add Comment' style='padding: 0 2px;min-width:330px;'><div id='static"+i+"' onclick='AddComment("+i+");'><div style='text-align:center'>+</div></div><div id='change"+i+"' style='display:none;white-space:nowrap;'><input class='inline' title='Add Comment' type='text' id='input"+i+"' value='' maxlength='50' onkeypress='EnterComment(event, "+i+");'>&nbsp;<b class='inline' title='Save' onclick='SaveComment("+i+");'>&nbsp;&radic;&nbsp;</b>&nbsp;<b class='inline' title='Cancel' onclick='CancelComment("+i+");'>&nbsp;&#215;&nbsp;</b></div></td>";
			}

			TableData += "<tr>";
			TableData += "<td style='padding: 0 2px;'>"+(i+1)+".</td>";
			TableData += "<td title='Select All => copy&paste to Excel!' style='padding: 0 2px;'>"+TimeData+"</td>";
			TableData += CommentData;
			TableData += "<td style='padding: 0 2px;' title='Delete current entry!'> <div style='padding: 0 10px;' onclick='DeleteEntry("+i+");'>&#10006;</div> </td>";
			TableData += "</tr>";
		}
	}
	TableData+='</table></div>';

	body.innerHTML=String+TableData;
}
function AddComment(ID){
    _$("static"+ID).style.display = 'none';
    _$("change"+ID).style.display = 'block';
    _$("input"+ID).focus();
    _$("input"+ID).select();
}
function SaveComment(ID){
    var value = _$("input"+ID).value;
    value = value.trim();

	var Storage=ReadLocalStorage();

	var Item = Storage[ID];
	var ItemComment =  Item.indexOf(CommentString);

	if ( ItemComment > 0 && value != '' ) {
		var Separation = Item.split(CommentString);
		var Injection = Separation[0]+CommentString+value;
		Storage[ID] = Injection;
		WriteLocalStorage(Storage);
		_$("static"+ID).innerHTML = value+" +";
	} else if ( ItemComment > 0 && value == '' ) {
		var Separation = Item.split(CommentString);
		var Injection = Separation[0];
		Storage[ID] = Injection;
		WriteLocalStorage(Storage);
		_$("static"+ID).innerHTML = "<div style='text-align:center'>+</div>";
	} else if ( ItemComment < 0 && value != '' ) {
		var Injection = Item+CommentString+value;
		Storage[ID] = Injection;
		WriteLocalStorage(Storage);
		_$("static"+ID).innerHTML = value+" +";
	} else {
		_$("static"+ID).innerHTML = "<div style='text-align:center'>+</div>";
		//console.log("No commenting");	
	}

    _$("static"+ID).style.display = 'block';
    _$("change"+ID).style.display = 'none';

}
function CancelComment(ID){
    _$("static"+ID).style.display = 'block';
    _$("change"+ID).style.display = 'none';
}
function EnterComment(event, ID){
	var key=event.keyCode || event.which;

	if(key==13){ SaveComment(ID); }
	if(key==27){ CancelComment(ID); }
	if(event.shiftKey && event.keyCode == 9){ 
		SaveComment(ID);
		AddComment(ID-1);
	}
	else if(key==9){ 
		SaveComment(ID);
		AddComment(ID+1);
	}
}
function CopyRawData(){
	var body = document.body;
	var Storage=ReadLocalStorage();
		console.clear();
	var TableData ='<div style="width:50%;text-align:center;margin: 5px auto;"><button class="btn btn-default" type="submit" onclick="EchoTime();">Close</button><br><textarea onClick="this.select();" style="width:100%;height:500px;background-color:white;overflow:auto;border:1px solid #ccc;">';
	if( Storage != null ){
		for(var i=0; i < Storage.length; i++){
			var Item = Storage[i];
			var ItemComment =  Item.indexOf(CommentString);
			if( ItemComment > 0 ){
				var Separation = Item.split(CommentString);
				TableData += Separation[0]+"\t"+Separation[1]+"\n";
			} else {
				TableData += Item+"\n";
			}
		}
	}
	TableData = TableData.trim();
	TableData+='</textarea></div>';
	body.innerHTML = TableData;
}
function Reload(URL){
    t1=window.setTimeout(function(){ window.location.href=URL; },1000);
}
function ClearTime(){
	localStorage.removeItem("TimeLog");
	console.log('Clear DATA');

	_$("table-data").innerHTML='<div class="alert alert-danger" role="alert">Close window/tab to avoid further logging!</div>';
}
function TimeLogger(){
	var CurrentURL=GetURL();
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
			
			document.write('<div style="position:fixed;bottom: 0;right:0;"><a href="'+CurrentURL+'?openlog" target="_self" style="color:white;background-color:grey;padding:3px 6px;z-index:100;text-decoration:none;border-top-left-radius:3px;">Open Log</a></div>');

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