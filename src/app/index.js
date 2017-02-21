
import sub from './sub';
let app  = document.createElement('div');
app.innerHTML = '<h1>Hello World2</h1>';
app.appendChild(sub());
document.body.appendChild(app);