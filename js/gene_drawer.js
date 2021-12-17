$(document).ready(function () {
	//$('.pick-a-color').pickAColor();
});

var drawGene = function () {
	var svg_div = document.getElementById('svg-div'), 
	  gene_name = $('#gene-name').val(), 
	  gene_size = parseInt($('#gene-size').val(), 10),
	  coding_region_s = parseInt($('#coding-region-start').val(), 10),
	  coding_region_e = parseInt($('#coding-region-end').val(), 10),
	  coding_region_size = coding_region_e - coding_region_s,
	  scale = parseFloat(gene_size)/10000,
	  gene_whole_size = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
	  gene_coding_region = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
	  exons_start = [],
	  exons_end = [],
	  snps_id = [],
	  snps_postion = [],
	  snps_postion_svg = {},
	  reference,
	  reference_txt,
	  gene_name_svg,
	  exon,
	  snp,	
	  snp_h,
	  snp_id,
	  exon_size,
	  len,
	  init_at = 0,
	  snp_y,
	  diff_ref,
	  gene_size_prop = 1000,
	  obj_id,
	  i;
	$('#svg-div').empty();

	$('.exon-start').each(function() {
		exons_start.push($(this).val());
	});
	$('.exon-end').each(function() {
		exons_end.push($(this).val());
	});

	$('.snp-id').each(function() {
		snps_id.push($(this).val());
	});
	$('.snp-position').each(function() {
		snps_postion.push($(this).val());
	});

	gene_whole_size.setAttribute('width', gene_size_prop);
	gene_whole_size.setAttribute('height', '3');
	gene_whole_size.setAttribute('y', '300');
	gene_whole_size.setAttribute('x', init_at);
	gene_whole_size.style.fill = '#cccccc';
	gene_whole_size.style.stroke = 'none';
	gene_coding_region.setAttribute('width', (parseFloat(coding_region_size) * gene_size_prop)/gene_size);
	gene_coding_region.setAttribute('height', '3');
	gene_coding_region.setAttribute('y', '300');
	gene_coding_region.setAttribute('x', init_at + (parseFloat(coding_region_s) * gene_size_prop)/gene_size);
	gene_coding_region.style.fill = '#808080';
	gene_coding_region.style.stroke = 'none';
	svg_div.appendChild(gene_whole_size);
	svg_div.appendChild(gene_coding_region);

	for (i = 0, len = exons_start.length; i < len; i = i + 1) {
		exon_size = parseInt(exons_end[i], 10) - parseInt(exons_start[i], 10);
		exon = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		exon.setAttribute('width', (parseFloat(exon_size) * gene_size_prop)/gene_size);
		exon.setAttribute('height', '30');
		exon.setAttribute('y', '285');
		exon.setAttribute('x', init_at + (parseFloat(exons_start[i]) * gene_size_prop)/gene_size);
		exon.style.fill = '#808080';
		svg_div.appendChild(exon);
		if (parseInt(exons_start[i]) < parseInt(coding_region_s)) {
			exon_size = parseInt(coding_region_s, 10) - parseInt(exons_start[i], 10);
			exon = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			exon.setAttribute('width', (parseFloat(exon_size) * gene_size_prop)/gene_size);
			exon.setAttribute('height', '30');
			exon.setAttribute('y', '285');
			exon.setAttribute('x', init_at + (parseFloat(exons_start[i])* gene_size_prop)/gene_size);
			exon.style.fill = '#cccccc';
			svg_div.appendChild(exon);
		}
		if (parseInt(exons_end[i]) > parseInt(coding_region_e)) {
			exon_size = parseInt(exons_end[i], 10) - parseInt(coding_region_e, 10);
			exon = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			exon.setAttribute('width', (parseFloat(exon_size) * gene_size_prop)/gene_size);
			exon.setAttribute('height', '30');
			exon.setAttribute('y', '285');
			exon.setAttribute('x',  init_at + (parseFloat(coding_region_e) * gene_size_prop)/gene_size);
			exon.style.fill = '#cccccc';
			svg_div.appendChild(exon);
		}
	}
	len = snps_postion.length;
	snp = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	snp_id = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	snp_h = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	snp.setAttribute('stroke-width', '1.2');
	snp.setAttribute('stroke', 'black');
	snp.setAttribute('x1', init_at + (parseFloat(snps_postion[len -1]) * gene_size_prop)/gene_size);
	snp.setAttribute('x2', init_at + (parseFloat(snps_postion[len - 1]) * gene_size_prop)/gene_size);
	snp.setAttribute('y1', '320');
	snp.setAttribute('y2', '275');
	snp_h.setAttribute('stroke-width', '1.2');
	snp_h.setAttribute('stroke', 'black');
	snp_h.setAttribute('x1', init_at + (parseFloat(snps_postion[len -1]) * gene_size_prop)/gene_size);
	snp_h.setAttribute('x2', init_at + 100 + (parseFloat(snps_postion[len -1]) * gene_size_prop)/gene_size);
	snp_h.setAttribute('y1', 275);
	snp_h.setAttribute('y2', 275);
	snp_id.setAttribute('x', init_at + 50 + (parseFloat(snps_postion[len - 1]) * gene_size_prop)/gene_size);
	snp_id.setAttribute('y', '270');
	snp_id.setAttribute('font-size', '14px');
	snp_id.textContent = snps_id[len-1];
	snp_id.setAttribute('text-anchor', 'middle');
	svg_div.appendChild(snp);
	svg_div.appendChild(snp_h);
	svg_div.appendChild(snp_id);
	snps_postion_svg[len -1] = 275;

	for (i = snps_postion.length - 2; i > -1; i = i - 1) {
		diff_ref = ((parseFloat(snps_postion[i + 1]) * gene_size_prop)/gene_size) - ((parseFloat(snps_postion[i]) * gene_size_prop)/gene_size);
		if (diff_ref < 120) {
			obj_id = i + 1;
			snp_y = snps_postion_svg[obj_id] - 20;
		} else {
			snp_y = 275;
		}
		snp = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		snp_id = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		snp_h = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		snp.setAttribute('stroke-width', '1.2');
		snp.setAttribute('stroke', 'black');
		snp.setAttribute('x1', init_at + (parseFloat(snps_postion[i]) * gene_size_prop)/gene_size);
		snp.setAttribute('x2', init_at + (parseFloat(snps_postion[i]) * gene_size_prop)/gene_size);
		snp.setAttribute('y1', '320');
		snp.setAttribute('y2', snp_y);
		snp_h.setAttribute('stroke-width', '1.2');
		snp_h.setAttribute('stroke', 'black');
		snp_h.setAttribute('x1', init_at + (parseFloat(snps_postion[i]) * gene_size_prop)/gene_size);
		snp_h.setAttribute('x2', init_at + 100 + (parseFloat(snps_postion[i]) * gene_size_prop)/gene_size);
		snp_h.setAttribute('y1', snp_y);
		snp_h.setAttribute('y2', snp_y);
		snp_id.setAttribute('x', init_at + 50 + (parseFloat(snps_postion[i]) * gene_size_prop)/gene_size);
		snp_id.setAttribute('y', snp_y - 5);
		snp_id.setAttribute('font-size', '14px');
		snp_id.textContent = snps_id[i];
		snp_id.setAttribute('text-anchor', 'middle');
		svg_div.appendChild(snp);
		svg_div.appendChild(snp_h);
		svg_div.appendChild(snp_id);
		snps_postion_svg[i] = snp_y;
	}
	reference =  document.createElementNS('http://www.w3.org/2000/svg', 'line');
	reference.setAttribute('stroke-width', '1.2');
	reference.setAttribute('stroke', 'black');
	reference.setAttribute('x1', init_at + (parseFloat(gene_size_prop) - (1000 * gene_size_prop)/gene_size));
	reference.setAttribute('x2', init_at + gene_size_prop);
	reference.setAttribute('y1', '380');
	reference.setAttribute('y2', '380');
	reference_txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	reference_txt.setAttribute('x', init_at + (parseFloat(gene_size_prop) - (500 * gene_size_prop)/gene_size));
	reference_txt.setAttribute('y', '400');
	reference_txt.textContent = '1Kb';
	reference_txt.setAttribute('text-anchor', 'middle');
	svg_div.appendChild(reference);
	svg_div.appendChild(reference_txt);

	gene_name_svg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	gene_name_svg.setAttribute('x', init_at);
	gene_name_svg.setAttribute('y', '400');
	gene_name_svg.setAttribute('font-size', '16px');
	gene_name_svg.textContent = gene_name;
	svg_div.appendChild(gene_name_svg);
};

var crearAll = function () {
	var allInputs = $( ":input" ),
	  len,
	  i;
	for (i = 0, len = allInputs.length; i < len; i = i + 1) {
		if (allInputs[i].type === 'text') {
			allInputs[i].value = '';
		}
	}
};

var createAddExon = function () {
	var row_exons = document.getElementById('exons'),
	  div_col_start = document.createElement('div'),
	  div_col_end = document.createElement('div'),
	  input_start = document.createElement('input'),
	  input_end = document.createElement('input');

	div_col_start.className = 'col-md-6';
	div_col_end.className = 'col-md-6';
	input_start.setAttribute('type', 'text');
	input_end.setAttribute('type', 'text');
	input_start.className = 'form-control exon-start';
	input_end.className = 'form-control exon-end';
	input_start.setAttribute('placeholder', 'Start');
	input_end.setAttribute('placeholder', 'End');

	div_col_start.appendChild(input_start);
	div_col_end.appendChild(input_end);
	row_exons.appendChild(div_col_start);
	row_exons.appendChild(div_col_end);
};

var createAddSNP = function () {
	var row_snps = document.getElementById('snps'),
	  div_col_id = document.createElement('div'),
	  div_col_position = document.createElement('div'),
	  input_id = document.createElement('input'),
	  input_position = document.createElement('input');

	div_col_id.className = 'col-md-6';
	div_col_position.className = 'col-md-6';
	input_id.setAttribute('type', 'text');
	input_position.setAttribute('type', 'text');
	input_id.className = 'form-control snp-id';
	input_position.className = 'form-control snp-position';
	input_id.setAttribute('placeholder', 'ID');
	input_position.setAttribute('placeholder', 'Position');

	div_col_id.appendChild(input_id);
	div_col_position.appendChild(input_position);
	row_snps.appendChild(div_col_id);
	row_snps.appendChild(div_col_position);
};

$('#add-exon-option').click(function () {
	createAddExon();
});

$('#add-snp-option').click(function () {
	createAddSNP();
});

$('#add-snp-option').click(function () {
});

$('#submit').click(function () {
	drawGene();
});

$('#clear').click(function () {
	crearAll();
});