COFFEE=./node_modules/coffeescript/bin/coffee

usage:
	@echo ''
	@echo 'Task         : Description'
	@echo '------------ : -----------'
	@echo 'make build   : Recompile from Coffeescript'
	@echo ''

build:
	$(COFFEE) -co lib src/

.PHONY: build
