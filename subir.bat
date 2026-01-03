@echo off
set /p mejora="¿Que mejoraste hoy en WillTech?: "
git add .
git commit -m "%mejora%"
git push origin main
echo.
echo ✅ ¡Cambios subidos con el mensaje: %mejora%!
pause