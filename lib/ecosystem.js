
function findEcosystem(percent, res){
	if (percent >=60 ){
		res.send('your ecosystem is '+ percent+ '% douglas fir.  It is a typical pacific lowland forest.');
	}
	else if (percent >=40){
		res.send('your ecosystem is '+ percent+ '% douglas fir.  It is probably a temperate rainforest.');
	}
	else if (percent >=20){
		res.send('your ecosystem is '+ percent+ '% douglas fir.  It is probably a subalpine forest.');
	}
	else if (percent >0){
		res.send('your ecosystem is '+ percent+ '% douglas fir.  That is very low.  Your ecosystem is probably on the margins, such as on a mountain or on the east side of the cascades.');
	}
	else{
		res.send('your ecosystem has no douglas fir.  It cannnot be in the pacific nortwest!');   
	}
    
}

module.exports = findEcosystem;