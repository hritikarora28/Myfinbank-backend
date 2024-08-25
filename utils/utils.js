// utils.js

exports.calculateEMI = (loanAmount, interestRate, loanTermMonths) => {
    const monthlyInterestRate = interestRate / (12 * 100);
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
                 (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    return emi.toFixed(2);
};
