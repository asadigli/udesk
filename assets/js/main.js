$.noConflict();
jQuery(document).ready(function($) {
	"use strict";
	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	});
	$('.selectpicker').selectpicker;
	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	$('.equal-height').matchHeight({
		property: 'max-height'
	});

	// var chartsheight = $('.flotRealtime2').height();
	// $('.traffic-chart').css('height', chartsheight-122);


	// Counter Number
	$('.count').each(function () {
		$(this).prop('Counter',0).animate({
			Counter: $(this).text()
		}, {
			duration: 3000,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now));
			}
		});
	});


	 
	 
	// Menu Trigger
	$('#menuToggle').on('click', function(event) {
		var windowWidth = $(window).width();   		 
		if (windowWidth<1010) { 
			$('body').removeClass('open'); 
			if (windowWidth<760){ 
				$('#left-panel').slideToggle(); 
			} else {
				$('#left-panel').toggleClass('open-menu');  
			} 
		} else {
			$('body').toggleClass('open');
			$('#left-panel').removeClass('open-menu');  
		} 
			 
	}); 

	 
	$(".menu-item-has-children.dropdown").each(function() {
		$(this).on('click', function() {
			var $temp_text = $(this).children('.dropdown-toggle').html(),
				slc = $(this).children('.sub-menu');
			slc.find(".subtitle").length == 0 ? slc.prepend('<li class="subtitle">' + $temp_text + '</li>') : ""; 
		});
	});


	// Load Resize 
	$(window).on("load resize", function(event) { 
		var windowWidth = $(window).width();  		 
		if (windowWidth<1010) {
			$('body').addClass('small-device'); 
		} else {
			$('body').removeClass('small-device');  
		} 
		
	});
	if ($( "link[href$='bootstrap-select.css']" ).length) {
		$('.multiple-select').selectpicker();
	}

	$(document.body).on("change",".sale_product",function(){
		let v = $(this).find("option:selected").data("price"),
			pid = $(this).find("option:selected").val(),
			q = $(".sale_quantity").val();
		let per = isNaN(v) ? v : (v).toFixed(2);
		$(".per_price,.per_real_price").val(per);
		let total = isNaN(v * q) ? v * q : (v * q).toFixed(2);
		$(".total_price").val(total)
	});

	$(document.body).on("keyup",".sale_quantity",function(){
		let v = $(this).val(),
			p = $(".per_price").val();
		let total = isNaN(v * p) ? v * p : (v * p).toFixed(2);
		$(".total_price").val(total)
	});

	$(document.body).on("keyup",".total_price",function(){
		let v = $(this).val(),
			q = $(".sale_quantity").val();
		let per = isNaN(v/q) ? v/q : (v/q).toFixed(2);
		$(".per_price").val(per)
	});
 
	$('[data-toggle="tooltip"]').tooltip();

	$(".barcode_more").on("click",function(){
		$(".barcode_more_div").toggleClass("hide");
	});

	$("#barcode").on('keypress',function(e) {
		if(e.which == 13) {
			let t = $(this);
			$.ajax({
				url: `/sale/check-barcode?barcode=${t.val()}`,
				type: 'GET',
				cache: true,
				success:function(d){
					if(d.length > 0){
						let v = d[0];
						let quantity = 1;
						let h = `<tr>
									<td>${v.barcode}</td>
									<td>${v.name}</td>
									<td>${v.price || 0}</td>
									<td>${quantity}</td>
								</tr>`;
						$("#sales_list_inbarcode tbody").append(h);
					}
					console.log(d);
				},complete:function(){
					t.val('');
				}
			});
		}
	});
	let current_year = new Date().getFullYear();
	$("#current_year").html(current_year)
});