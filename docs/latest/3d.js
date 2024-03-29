var PI = Math.PI
var toRadians = (degrees) => degrees * PI / 180
var toDegrees = (radians) => radians * 180 / PI

var VIEW_WIDTH = 800
var VIEW_HEIGHT = 600
var FOV = 85
var DISTANCE = 100
var PADDING = 10

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function transform2Dto3D(vec2, vec3, cosPan, sinPan, cosTilt, sinTilt) {
  return vec3
}

// Create a 3D point
function Point3D({x, y, z, color, label}) {
  this.x = x
  this.y = y
  this.z = z
  this.color = color
  this.label = label || ''
}

function draw2DPoint(point, showLabel = true) {
  var x = point.x
  var y = point.y

  ctx.save()

  if (showLabel && point.label) {
    ctx.fillStyle = point.color
    ctx.fillText(point.label, x, y)
  } else {
    ctx.strokeStyle = point.color
    ctx.arc(x, y, 2, 0, 2 * PI)
  }
  ctx.restore()
}

function draw2DLine(p1, p2, showLabel = true) {
  var x0 = p1.x
  var y0 = p1.y
  var x1 = p2.x
  var y1 = p2.y

  ctx.save()

  ctx.lineWidth = 2
  ctx.strokeStyle = p2.color || 'lightgrey'
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()

  if (showLabel) {
    draw2DPoint(p1)
    draw2DPoint(p2)
  }

  ctx.restore()
}

var VIEW_CENTER = new Point3D({
  x:canvas.width / 2, 
  y:canvas.width / 2, 
  z:0
})
VIEW_CENTER.type = 'VIEW_CENTER'
VIEW_CENTER.color = 'gray'

function makeCube() {
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

function makeXYZ() {
  var x0 = new Point3D({ x:1, y:0, z:0, color:'red', label:'X' })
  var y0 = new Point3D({ x:0, y:-1, z:0, color:'blue', label:'Y' })
  var z0 = new Point3D({ x:0, y:0, z:1, color:'green', label:'Z' })
  var vertices = [x0, y0, z0]
  return vertices
}

function vertexProcessing(vertex, ratio, angle, position) {
  vertex = scale(vertex, ratio)
  vertex = rotate(vertex, angle)
  vertex = translate(vertex, position)
  return vertex
}

function drawCube(cube, size, angle, position, showCoords = false, showCorners = false) {
  var cube = cube.map(vertex => vertexProcessing(vertex, size, angle, position))
  drawFaces(cube)

  if (showCorners) {
    for (var vertex of cube) {
      draw2DPoint(vertex, showCorners)
    }
  }

  if (showCoords) {
    var xyz = makeXYZ().map(vertex => vertexProcessing(vertex, size / 2, angle, position))
    for (var vertex of xyz) {
      draw2DLine(position, vertex)
    }
  }
}

function drawFaces(cube) {
  var [p1, p2, p3, p4, p5, p6, p7, p8] = cube
  drawFace(p1, p2, p3, p4)
  drawFace(p2, p6, p7, p3)
  drawFace(p3, p4, p8, p7)
  drawFace(p4, p1, p5, p8)
  drawFace(p5, p6, p7, p8)
  drawFace(p6, p5, p1, p2)
}

function drawFace(p1, p2, p3, p4) {
  draw2DLine(p1, p2, false)
  draw2DLine(p2, p3, false)
  draw2DLine(p3, p4, false)
  draw2DLine(p4, p1, false)
}

var Vec3 = (x, y, z) => {
  var vec = [x, y, z]
  vec.x = x
  vec.y = y
  vec.z = z
  vec.type = 'VEC3'
  vec.at = (index) => vec[index]
  vec.setAt = (index, value) => (vec[index] = value)
  return vec
}

var Mat3 = (a, b, c, d, e, f, g, h, j) => {
  var mat = [
    ...Vec3(a, b, c),
    ...Vec3(d, e, f),
    ...Vec3(g, h, j),
  ]

  mat.type = 'MAT3'
  mat.at = (y, x) => mat[y * 3 + x]
  mat.setAt = (y, x, value) => (mat[y * 3 + x] = value)
  mat.multiply_vec3 = (to) => {
    return Vec3(
      mat.at(0, 0) * to.x + mat.at(0, 1) * to.x + mat.at(0, 2) * to.x,
      mat.at(1, 0) * to.y + mat.at(1, 1) * to.y + mat.at(1, 2) * to.y,
      mat.at(2, 0) * to.z + mat.at(2, 1) * to.z + mat.at(2, 2) * to.z,
    )
  }
  return mat
}

var cos = Math.cos
var sin = Math.sin

var MAT3_ZERO = Mat3(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
)

var MAT3_TRANSLATE = (to) => Mat3(
  1, 0, to.x,
  0, 1, to.y,
  0, 0, 1,
)

var MAT3_ROTATE_Z = (theta) => Mat3(
  cos(theta), -sin(theta), 0,
  sin(theta),  cos(theta), 0,
  0, 0, 1,
)

var MAT3_ROTATE_X = (theta) => Mat3(
  1, 0, 0,
  0, cos(theta), -sin(theta),
  0, sin(theta),  cos(theta),
)

var MAT3_ROTATE_Y = (theta) => Mat3(
  cos(theta), 0, sin(theta),
  0, 1, 0,
  -sin(theta), 0, cos(theta)
)

function product_mat3_mat3(left, right) {
  var [x0, y0, z0] = multiply_mat3_vec3(left, Vec3(right.at(0, 0), right.at(1, 0), right.at(2, 0)))
  var [x1, y1, z1] = multiply_mat3_vec3(left, Vec3(right.at(0, 1), right.at(1, 1), right.at(2, 1)))
  var [x2, y2, z2] = multiply_mat3_vec3(left, Vec3(right.at(0, 2), right.at(1, 2), right.at(2, 2)))
  return Mat3(
    x0, x1, x2,
    y0, y1, y2,
    z0, z1, z2,
  )
}

function multiply_mat3_vec3(from, to) {
  var x = from.at(0, 0) * to.x + from.at(0, 1) * to.y + from.at(0, 2) * to.z
  var y = from.at(1, 0) * to.x + from.at(1, 1) * to.y + from.at(1, 2) * to.z 
  var z = from.at(2, 0) * to.x + from.at(2, 1) * to.y + from.at(2, 2) * to.z 
  return [x, y, z]
}

function scale(point, ratio) {
  var [x, y, z] = multiply_mat3_vec3(MAT3_ZERO, point).map(x => x * ratio)
  return new Point3D({ ...point, x, y, z })
}

function rotate(point, angle) {
  var radianX = toRadians(angle + angleX)
  var radianY = toRadians(angle + angleY)
  var radianZ = toRadians(angle + angleZ)

  var ZY = product_mat3_mat3(MAT3_ROTATE_Z(radianZ), MAT3_ROTATE_Y(radianY))
  var XZY = product_mat3_mat3(MAT3_ROTATE_X(radianX), ZY)
  var [x, y, z] = multiply_mat3_vec3(XZY, point)

  return new Point3D({ ...point, x, y, z })
}

function translateX(point, x) {
  var x = point.x + x
  return new Point3D({ ...point, x })
}

function translateY(point, y) {
  var y = point.y + y
  return new Point3D({ ...point, y })
}

function translateZ(point, z) {
  var z = point.z + z
  return new Point3D({ ...point, z })
}

function translate(from, to) {
  var [x, y, z] = multiply_mat3_vec3(MAT3_TRANSLATE(from), to)
  var x = translateX(from, x).x
  var y = translateY(from, y).y
  var z = translateZ(from, z).z
  return new Point3D({...from, x, y, z})
}

var angle = 0
var angleX = 0
var angleY = 0
var angleZ = 0
var translatedX = VIEW_CENTER.x
var translatedY = VIEW_CENTER.y
var translatedZ = VIEW_CENTER.z

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  var cube1 = makeCube()

  drawCube(
    cube1,
    50,
    angle,
    Vec3(translatedX, translatedY, translatedZ),
    true, true
  )

  // requestAnimationFrame(loop)
}
loop()

canvas.addEventListener('pointermove', lookAt)
canvas.addEventListener('mousemove', lookAt)
function lookAt(ev) {
  var mouseX = ev.offsetX - VIEW_CENTER.x
  var mouseY = ev.offsetY - VIEW_CENTER.y
  angleY = mouseX / 2
  angleX = -mouseY / 2
  loop()
}

document.addEventListener('keypress', function(e) {
  switch (e.keyCode) {
  
  // TRANSLATE X
  case 97: // A
    translatedX -= 2
    break

  case 100: // D
    translatedX += 2
    break

  // TRANSLATE Y
  case 119: // W
    translatedY -= 2
    break

  case 115: // S
    translatedY += 2
    break

  // TRANSLATE Z
  case 61: // + ZOOM IN
    translatedZ += 0.1
    break

  case 45: // - ZOOM OUT
    translatedZ -= 0.1
    break

  // ROTATE X
  case 105: // I
    angleX += 1
    break

  case 107: // K
    angleX -= 1
    break

  // ROTATE Y
  case 106: // J
    angleY -= 1
    break

  case 108: // L
    angleY += 1
    break

  // ROTATE Z
  case 117: // U
    angleZ -= 1
    break

  case 111: // O
    angleZ += 1
    break

  default:
    break
  }

  loop()
})

// TEST
test('should do the product 3x3 correctly', function() {
  var left = Mat3(
    2, 7, 3,
    1, 5, 8,
    0, 4, 1
  )

  var right = Mat3(
    3, 0, 1,
    2, 1, 0,
    1, 2, 4
  )

  var p = product_mat3_mat3(left, right)
  expectPairEqual(
    p.at(0, 0), 23,
    p.at(0, 1), 13,
    p.at(0, 2), 14,
    p.at(1, 0), 21,
    p.at(1, 1), 21,
    p.at(1, 2), 33,
    p.at(2, 0), 9,
    p.at(2, 1), 6,
    p.at(2, 2), 4,
  )
})

function test(name, tester) {
  tester()
  console.log(`${name}: OK!`)
}

function expectPairEqual(...args) {
  for (let index = 0; index < args.length; index+=2) {
    const left = args[index]
    const right = args[index+1]
    if (left !== right) throw new Error(`Expect: ${left} === ${right}`)
  }
}
