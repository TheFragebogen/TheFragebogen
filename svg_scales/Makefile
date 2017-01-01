all : quality7pt_scale_include.svg visual_analogue_scale100pt_include.svg nasa_tlx_scale_include.svg

clean :
	rm -rf *include.svg

%_include.svg : %.svg Makefile
	inkscape $< --export-plain-svg=$@.tmp && \
	cat $@.tmp | tidy -xml -w 1000 --quiet yes | tr -d '\n' | sed "s/'/\"/g"> $@ && \
	rm $@.tmp
