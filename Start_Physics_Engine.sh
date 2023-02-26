#!/bin/bash
ps -ef | grep "php -S localhost:8000" | grep -v grep | awk '{print $2}' | xargs kill
input=""

while [[ "$input" != "Y" ]] && [[ "$input" != "N" ]]
do
		read -p "Run server in background? (Y)es/(N)o " input
done

if [[ "$input" == "Y" ]]; then
		echo "Starting PHP server in background..."
		cd Physics_Engine_Code
		open http://localhost:8000
		nohup php -S localhost:8000 & 
elif [[ "$input" == "N" ]]; then 
		echo "Starting PHP server..."
		cd Physics_Engine_Code
		open http://localhost:8000
		php -S localhost:8000
fi

