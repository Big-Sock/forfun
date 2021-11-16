import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";

export const Approval = ({ kycSubmitted, ecpSubmitted, approved, pendingApproval }) => {

  if (kycSubmitted && ecpSubmitted && !approved) {
    Swal.fire("Submission Successful", "You have successfully submitted your application!", "success")
    return (
      <ApprovalSection>
        All of your documents have been submitted and are pending approval: this may
        take a few days...
        <br/>
        You'll receive an email when approved!
      </ApprovalSection>
    )
  } else if (pendingApproval.kyc || pendingApproval.ecp) {
    return (
      <ApprovalSection>
        Please sign all forms to access trading...
      </ApprovalSection>
    )
  } else {
    return (
      <ApprovalSection>
        Something went wrong... Please contact us for assistance - info@stockswap.com.
      </ApprovalSection>
    )
  }

};

const ApprovalSection = styled.div`
  margin: 10px 0;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #17171a;
  color: white;
  padding: 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-size: 20px;
`;
