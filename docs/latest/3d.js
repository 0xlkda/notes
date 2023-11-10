const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Create a 3D point
function Point3D({x, y, z, color, label}) {
  this.x = x
  this.y = y
  this.z = z
  this.color = color
  this.label = label || ''
}

function rotateX(point, angle) {
  var angle = angle * Math.PI / 180
  var y = point.y * Math.cos(angle) - point.z * Math.sin(angle)
  var z = point.y * Math.sin(angle) + point.z * Math.cos(angle)
  return new Point3D({ ...point, y, z })
}

function rotateY(point, angle) {
  var angle = angle * Math.PI / 180
  var z = point.z * Math.cos(angle) - point.x * Math.sin(angle)
  var x = point.z * Math.sin(angle) + point.x * Math.cos(angle)
  return new Point3D({ ...point, x, z })
}

function rotateZ(point, angle) {
  var angle = angle * Math.PI / 180
  var x = point.x * Math.cos(angle) - point.y * Math.sin(angle)
  var y = point.x * Math.sin(angle) + point.y * Math.cos(angle)
  return new Point3D({ ...point, x, y })
}

function draw2DPoint(point) {
  var x = point.x
  var y = point.y

  ctx.save()
  if (point.label) {
    ctx.fillStyle = point.color
    ctx.fillText(point.label, x, y)
  } else {
    ctx.strokeStyle = point.color
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, 2 * Math.PI)
    ctx.stroke()
  }
  ctx.restore()
}

function draw2DLine(p1, p2, showPoint = true) {
  var x0 = p1.x
  var y0 = p1.y
  var x1 = p2.x
  var y1 = p2.y

  ctx.save()
  ctx.strokeStyle = p2.color
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()

  if (showPoint) {
    draw2DPoint(p1)
    draw2DPoint(p2)
  }

  ctx.restore()
}

var CENTER = new Point3D({
  x:canvas.width / 2, 
  y:canvas.width / 2, 
  z:0
})

function translate(point, to) {
  var x = point.x + to.x
  var y = point.y + to.y
  var z = point.z + to.z
  return new Point3D({...point, x, y, z})
}

function scale(point, ratio) {
  var x = point.x * ratio
  var y = point.y * ratio
  var z = point.z * ratio
  return new Point3D({...point, x, y, z})
}

function makeCube(origin) {
  var p1 = new Point3D({x:-1.0, y:-1.0, z: 1.0, label: 'p1'})
  var p2 = new Point3D({x: 1.0, y:-1.0, z: 1.0, label: 'p2'})
  var p3 = new Point3D({x: 1.0, y: 1.0, z: 1.0, label: 'p3'})
  var p4 = new Point3D({x:-1.0, y: 1.0, z: 1.0, label: 'p4'})

  var p5 = new Point3D({x:-1.0, y:-1.0, z: -1.0, label: 'p5'})
  var p6 = new Point3D({x: 1.0, y:-1.0, z: -1.0, label: 'p6'})
  var p7 = new Point3D({x: 1.0, y: 1.0, z: -1.0, label: 'p7'})
  var p8 = new Point3D({x:-1.0, y: 1.0, z: -1.0, label: 'p8'})

  return [p1, p2, p3, p4, p5, p6, p7, p8]
}

function makeXYZ(origin) {
  var x0 = new Point3D({ x:1, y:0, z:0, color:'red', label:'X' })
  var y0 = new Point3D({ x:0, y:1, z:0, color:'blue', label:'Y' })
  var z0 = new Point3D({ x:0, y:0, z:1, color:'green', label:'Z' })
  var vertices = [x0, y0, z0]
  return vertices
}

function drawCube(angle, position) {
  var origin = position
  var xyz = makeXYZ(origin)
  var cube = makeCube(origin)
  var cubeTranslated = []

  function vertexProcessing(vertex) {
    vertex = scale(vertex, 50)
    vertex = rotateX(vertex, -angle)
    vertex = rotateY(vertex, -angle)
    vertex = rotateZ(vertex, 0)
    vertex = translate(vertex, origin)
    return vertex
  }

  for (var vertex of cube) {
    vertex = vertexProcessing(vertex)
    draw2DPoint(vertex)
    cubeTranslated.push(vertex)
  }

  // faces
  var [p1, p2, p3, p4, p5, p6, p7, p8] = cubeTranslated
  drawFace(p1, p2, p3, p4)
  drawFace(p2, p6, p7, p3)
  drawFace(p3, p4, p8, p7)
  drawFace(p4, p1, p5, p8)
  drawFace(p5, p6, p7, p8)
  drawFace(p6, p5, p1, p2)

  // xyz
  for (var vertex of xyz) {
    vertex = vertexProcessing(vertex)
    draw2DLine(origin, vertex)
  }
}

function drawFace(p1, p2, p3, p4) {
  draw2DLine(p1, p2, false)
  draw2DLine(p2, p3, false)
  draw2DLine(p3, p4, false)
  draw2DLine(p4, p1, false)
}

function loop(dt) {
  var angle = (dt / 10) % 360
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCube(angle, CENTER)
  requestAnimationFrame(loop)
}

loop()
