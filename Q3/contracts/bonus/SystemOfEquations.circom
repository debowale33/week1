pragma circom 2.0.0;

include "../../node_modules/circomlib-matrix/circuits/matElemSum.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";
include ""; // hint: you can use more than one templates in circomlib-matrix to help you

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
}

//creates  an instance of the matMul circuit
component multi = matMul(n,n,1);

// this loop populates the input of the multi circuit
for (var i = 0; i <n; i++) {
    for (var j = 0; j < n; j++) {
        multi.a[i][j] <== A[i][j];
    }
    multi.b[i][0] <==x[i];
}

component math = matElemSum(n, 1);
component math_ = matElemSum(n, 1);

component main {public [A, b]} = SystemOfEquations(3);