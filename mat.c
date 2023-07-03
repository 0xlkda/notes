#include <assert.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
  size_t rows;
  size_t cols;
  float *elements;
} Mat;

#define MAT_AT(m, i, j) (m).elements[(i) * (m).cols + (j)]

Mat mat_alloc(size_t rows, size_t cols) {
  Mat m;
  m.rows = rows;
  m.cols = cols;
  m.elements = malloc(sizeof(*m.elements) * rows * cols);
  assert(m.elements != NULL);
  return m;
}

void mat_fill(Mat m, float x) {
  for (size_t i = 0; i < m.rows; ++i) {
    for (size_t j = 0; j < m.cols; ++j) {
      MAT_AT(m, i, j) = x;
    }
  }
}

void mat_sum(Mat dst, Mat a) {
  assert(dst.rows == a.rows);
  assert(dst.cols == a.cols);

  for (size_t i = 0; i < dst.rows; ++i) {
    for (size_t j = 0; j < dst.cols; ++j) {
      MAT_AT(dst, i, j) += MAT_AT(a, i, j);
    }
  }
}

void mat_dot(Mat dst, Mat a, Mat b) {
  assert(a.cols == b.rows);
  size_t inner_bound = a.cols;

  assert(dst.rows == a.rows);
  assert(dst.cols == b.cols);

  for (size_t i = 0; i < dst.rows; ++i) {
    for (size_t j = 0; j < dst.cols; ++j) {
      // init element at position [i,j]
      MAT_AT(dst, i, j) = 0;

      // iterate through "inner" elements of 2 matries
      for (size_t k = 0; k < inner_bound; ++k) {
        MAT_AT(dst, i, j) += MAT_AT(a, i, k) * MAT_AT(b, k, j);
      }
    }
  }
}

void mat_print(Mat m, const char *name, size_t padding) {
  printf("%*s%s = [\n", (int)padding, "", name);
  for (size_t i = 0; i < m.rows; ++i) {
    printf("%*s    ", (int)padding, "");
    for (size_t j = 0; j < m.cols; ++j) {
      printf("%f ", MAT_AT(m, i, j));
    }
    printf("\n");
  }
  printf("%*s]\n", (int)padding, "");
}

int main(int argc, char *argv[]) {
  printf("hello ml world\n");

  Mat m = mat_alloc(1, 2);
  mat_fill(m, 1);
  mat_print(m, "M", 0);

  Mat n = mat_alloc(2, 2);
  mat_fill(n, 1);
  mat_print(n, "N", 0);

  Mat dot = mat_alloc(m.rows, n.cols);
  mat_dot(dot, m, n);
  mat_print(dot, "Dot MxN", 0);

  return EXIT_SUCCESS;
}
