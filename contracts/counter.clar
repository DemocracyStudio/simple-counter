
;; counter
;; simple counter app to play with stacks blockchain

;; constants
;;
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR-INVALID-UINT u100)
(define-constant ERR-NO-NEGATIVE-COUNTS u101)

;; data maps and vars
;;
(define-data-var count uint u0)

;; private functions
;;

;; public functions
;;

;;  (define-public (increment) 
;;      (begin
;;       (var-set count (+ (get-count) u1))
;;      (ok true)
;;      )
;;  )

;; read the current count
(define-read-only (get-count) 
    (var-get count)
)
;; increment the count
(define-public (increment) 
    (ok (var-set count (+ (get-count) u1)))
)
;; decrement
(define-public (decrement) 
    (begin 
        (asserts! (> (get-count) u0) (err ERR-NO-NEGATIVE-COUNTS))
        (ok (var-set count (- (get-count) u1)))
    )

)

(define-public (set-count (new-count uint))
    (ok (var-set count new-count))
)