#!/bin/bash
cd /home/kavia/workspace/code-generation/professional-portfolio-website-186495-186504/frontend_react_js
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

